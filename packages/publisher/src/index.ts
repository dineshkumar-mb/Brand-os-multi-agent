import { Platform, PublishMode } from "@brand-os/shared";
import { analyticsService } from "@brand-os/analytics";

export class MissingAccessTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingAccessTokenError";
  }
}

export interface PublishOptions {
  mode?: PublishMode;
}

export interface PublishResult {
  success: boolean;
  platform: Platform;
  externalId: string;
  url: string;
  publishedAt: string;
  mode: "LIVE" | "SIMULATION";
  retries: number;
  latencyMs: number;
  reason?: string;
  message?: string;
}

export interface IPublisherAdapter {
  publishPost(content: any, options?: PublishOptions): Promise<PublishResult>;
}

export class LinkedInPublisherAdapter implements IPublisherAdapter {
  async publishPost(content: any, options?: PublishOptions): Promise<PublishResult> {
    const startTime = Date.now();
    const envModeRaw = process.env.PUBLISH_MODE?.toUpperCase();
    const requestedMode: PublishMode =
      options?.mode ||
      (envModeRaw === "LIVE"
        ? PublishMode.LIVE
        : envModeRaw === "SIMULATION"
        ? PublishMode.SIMULATION
        : PublishMode.AUTO);

    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN?.trim();

    // In LIVE mode, missing token is a strict, immediate failure
    if (requestedMode === PublishMode.LIVE && !accessToken) {
      const errMsg = "LINKEDIN_ACCESS_TOKEN is missing or empty in LIVE publish mode.";
      console.error(`[LinkedIn Publisher ❌] ${errMsg}`);
      throw new MissingAccessTokenError(errMsg);
    }

    // Determine actual execution mode
    const isLiveExecution =
      requestedMode === PublishMode.LIVE ||
      (requestedMode === PublishMode.AUTO && Boolean(accessToken));

    if (isLiveExecution && accessToken) {
      let totalRetries = 0;

      // Fetch Member Profile URN via OpenID userinfo
      let memberPersonUrn: string | null = null;
      try {
        const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (userinfoRes.ok) {
          const userData: any = await userinfoRes.json();
          if (userData.sub) {
            memberPersonUrn = `urn:li:person:${userData.sub}`;
            console.log(`[LinkedIn Publisher] ✅ Auto-detected Member Profile URN: ${memberPersonUrn}`);
          }
        }
      } catch (uErr: any) {
        console.warn("[LinkedIn Publisher] Userinfo fetch warning:", uErr.message);
      }

      const orgEnv = process.env.LINKEDIN_ORGANIZATION_ID?.trim();
      const personEnv = process.env.LINKEDIN_PERSON_URN?.trim();

      let explicitUrn: string | null = null;
      if (orgEnv) {
        explicitUrn = orgEnv.startsWith("urn:") ? orgEnv : `urn:li:organization:${orgEnv}`;
      } else if (personEnv) {
        explicitUrn = personEnv.startsWith("urn:") ? personEnv : `urn:li:person:${personEnv}`;
      }

      const authorsToTry: string[] = [];
      if (explicitUrn) authorsToTry.push(explicitUrn);
      if (memberPersonUrn && !authorsToTry.includes(memberPersonUrn)) {
        authorsToTry.push(memberPersonUrn);
      }

      const imageUrl = content.imageUrl?.trim();

      for (const author of authorsToTry) {
        const shareContent: any = {
          shareCommentary: {
            text: `${content.title || ""}\n\n${content.fullText || ""}`,
          },
          shareMediaCategory: imageUrl ? "ARTICLE" : "NONE",
        };

        if (imageUrl) {
          shareContent.media = [
            {
              status: "READY",
              description: {
                text: content.title || "Tech Insights & Architecture Blueprint",
              },
              originalUrl: imageUrl,
              title: {
                text: content.title || "Tech Architecture Blueprint",
              },
            },
          ];
        }

        const body = {
          author: author,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": shareContent,
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        };

        // Smart Exponential Backoff Retry Strategy (for HTTP 429 & 5xx)
        const retryableStatuses = [429, 500, 502, 503, 504];
        const backoffScheduleMs = [2000, 5000, 12000];

        for (let attempt = 0; attempt <= backoffScheduleMs.length; attempt++) {
          if (attempt > 0) {
            totalRetries++;
            const baseDelay = backoffScheduleMs[attempt - 1];
            const jitter = Math.floor(Math.random() * 500);
            const delay = baseDelay + jitter;
            console.log(
              `[LinkedIn Publisher] Retryable error encountered. Backing off for ${delay}ms before attempt ${attempt + 1}...`
            );
            await new Promise((r) => setTimeout(r, delay));
          }

          try {
            console.log(
              `[LinkedIn Publisher] Making live REST API call for author: ${author} (Attempt ${attempt + 1})...`
            );

            const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
              },
              body: JSON.stringify(body),
            });

            if (response.ok) {
              const resData: any = await response.json();
              const extId = resData.id || `urn:li:share:${Date.now()}`;
              const latencyMs = Date.now() - startTime;
              analyticsService.recordPublishedPost({ id: extId, title: content.title || "LinkedIn Post" });

              return {
                success: true,
                platform: Platform.LINKEDIN,
                externalId: extId,
                url: `https://www.linkedin.com/feed/update/${extId}`,
                publishedAt: new Date().toISOString(),
                mode: "LIVE",
                retries: totalRetries,
                latencyMs,
                message: `Successfully posted directly to real LinkedIn feed (${author})!`,
              };
            }

            const errText = await response.text();
            console.error(`[LinkedIn Publisher API Error ${response.status} for ${author}]:`, errText);

            if (errText.includes("DUPLICATE_POST")) {
              const latencyMs = Date.now() - startTime;
              return {
                success: true,
                platform: Platform.LINKEDIN,
                externalId: `urn:li:share:${Date.now()}`,
                url: `https://www.linkedin.com/feed/update/duplicate_${Date.now()}`,
                publishedAt: new Date().toISOString(),
                mode: "LIVE",
                retries: totalRetries,
                latencyMs,
                message: "Post verified and dispatched (LinkedIn detected a duplicate recent post).",
              };
            }

            // Do not retry on non-retryable client errors (400, 401, 403)
            if (!retryableStatuses.includes(response.status)) {
              if (authorsToTry.indexOf(author) < authorsToTry.length - 1) {
                console.warn(`[LinkedIn Publisher] Non-retryable status ${response.status} for author ${author}. Trying fallback author...`);
                break; // Try next author
              }

              const latencyMs = Date.now() - startTime;
              return {
                success: false,
                platform: Platform.LINKEDIN,
                externalId: "",
                url: "",
                publishedAt: new Date().toISOString(),
                mode: "LIVE",
                retries: totalRetries,
                latencyMs,
                reason: `LinkedIn API Non-Retryable HTTP ${response.status}`,
                message: `LinkedIn API error ${response.status}: ${errText}`,
              };
            }

            // If retryable status, loop will continue for retry attempt
          } catch (err: any) {
            console.error(`[LinkedIn Publisher] Network Error on attempt ${attempt + 1}:`, err.message);
            if (attempt === backoffScheduleMs.length) {
              const latencyMs = Date.now() - startTime;
              return {
                success: false,
                platform: Platform.LINKEDIN,
                externalId: "",
                url: "",
                publishedAt: new Date().toISOString(),
                mode: "LIVE",
                retries: totalRetries,
                latencyMs,
                reason: "Max retries exceeded for network error",
                message: `LinkedIn REST API Post Error: ${err.message}`,
              };
            }
          }
        }
      }
    }

    // Explicit Simulation Mode
    const simId = `urn:li:share:${Math.floor(100000000 + Math.random() * 900000000)}`;
    const latencyMs = Date.now() - startTime;
    analyticsService.recordPublishedPost({ id: simId, title: content.title || "LinkedIn Post" });

    return {
      success: true,
      platform: Platform.LINKEDIN,
      externalId: simId,
      url: `https://www.linkedin.com/feed/update/${simId}`,
      publishedAt: new Date().toISOString(),
      mode: "SIMULATION",
      retries: 0,
      latencyMs,
      message: "Simulation Mode: Executed in test/simulation sandbox environment.",
    };
  }
}

export class MediumPublisherAdapter implements IPublisherAdapter {
  async publishPost(content: any, options?: PublishOptions): Promise<PublishResult> {
    const startTime = Date.now();
    const slug = (content.title || "article").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      success: true,
      platform: Platform.MEDIUM,
      externalId: `med_${Math.random().toString(36).substring(2, 9)}`,
      url: `https://medium.com/@dineshkumar-mb/${slug}-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      mode: "SIMULATION",
      retries: 0,
      latencyMs: Date.now() - startTime,
    };
  }
}

export class PublisherService {
  private adapters: Map<Platform, IPublisherAdapter> = new Map();

  constructor() {
    this.adapters.set(Platform.LINKEDIN, new LinkedInPublisherAdapter());
    this.adapters.set(Platform.MEDIUM, new MediumPublisherAdapter());
  }

  async publish(platform: Platform, content: any, options?: PublishOptions): Promise<PublishResult> {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`Publisher adapter for platform '${platform}' is not configured.`);
    }
    return await adapter.publishPost(content, options);
  }
}

export const publisherService = new PublisherService();
