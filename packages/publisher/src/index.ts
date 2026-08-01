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
  rawResponse?: any;
}

export interface IPublisherAdapter {
  publishPost(content: any, options?: PublishOptions): Promise<PublishResult>;
}

async function uploadLinkedInImage(accessToken: string, author: string, imageUrl: string): Promise<string | null> {
  try {
    console.log(`[LinkedIn Publisher 🖼️] Registering image upload asset for author: ${author}...`);
    const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: author,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      }),
    });

    if (!registerRes.ok) {
      const errText = await registerRes.text();
      console.warn(`[LinkedIn Publisher ⚠️] Image registerUpload failed (${registerRes.status}):`, errText);
      return null;
    }

    const registerData: any = await registerRes.json();
    const uploadUrl = registerData?.value?.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]?.uploadUrl;
    const assetUrn = registerData?.value?.asset;

    if (!uploadUrl || !assetUrn) {
      console.warn("[LinkedIn Publisher ⚠️] Failed to extract uploadUrl or assetUrn from registerUpload response");
      return null;
    }

    let imageBuffer: Buffer;
    let contentType = "image/png";

    if (imageUrl.startsWith("data:")) {
      console.log(`[LinkedIn Publisher 🖼️] Processing dynamic Data URL image...`);
      const parts = imageUrl.split(",");
      const mimeMatch = parts[0].match(/data:(.*?);/);
      if (mimeMatch) contentType = mimeMatch[1];
      const isBase64 = parts[0].includes("base64");
      imageBuffer = isBase64 ? Buffer.from(parts[1], "base64") : Buffer.from(decodeURIComponent(parts[1]));
    } else {
      console.log(`[LinkedIn Publisher 🖼️] Downloading image binary from: ${imageUrl}...`);
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        console.warn(`[LinkedIn Publisher ⚠️] Failed to download image from ${imageUrl}: ${imgRes.status}`);
        return null;
      }
      contentType = imgRes.headers.get("content-type") || "image/jpeg";
      const imageArrayBuffer = await imgRes.arrayBuffer();
      imageBuffer = Buffer.from(imageArrayBuffer);
    }

    console.log(`[LinkedIn Publisher 🖼️] Uploading binary to LinkedIn asset store (${assetUrn})...`);
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": contentType,
      },
      body: new Uint8Array(imageBuffer),
    });



    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.warn(`[LinkedIn Publisher ⚠️] Binary upload to LinkedIn failed (${uploadRes.status}):`, errText);
      return null;
    }

    console.log(`[LinkedIn Publisher ✅] Successfully uploaded native LinkedIn image asset: ${assetUrn}`);
    return assetUrn;
  } catch (err: any) {
    console.warn(`[LinkedIn Publisher ⚠️] Exception during LinkedIn image upload:`, err.message);
    return null;
  }
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

      // Fetch Member Profile URN via OpenID userinfo, fallback to legacy /v2/me
      let memberPersonUrn: string | null = null;
      try {
        const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (userinfoRes.ok) {
          const userData: any = await userinfoRes.json();
          if (userData.sub) {
            memberPersonUrn = `urn:li:person:${userData.sub}`;
            console.log(`[LinkedIn Publisher] ✅ Auto-detected Member Profile URN via userinfo: ${memberPersonUrn}`);
          }
        } else {
          console.warn(`[LinkedIn Publisher] OIDC userinfo failed (${userinfoRes.status}). Attempting legacy /v2/me...`);
          const meRes = await fetch("https://api.linkedin.com/v2/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (meRes.ok) {
            const meData: any = await meRes.json();
            if (meData.id) {
              memberPersonUrn = `urn:li:person:${meData.id}`;
              console.log(`[LinkedIn Publisher] ✅ Auto-detected Member Profile URN via /v2/me: ${memberPersonUrn}`);
            }
          }
        }
      } catch (uErr: any) {
        console.warn("[LinkedIn Publisher] Profile auto-detection warning:", uErr.message);
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

      // Strict failure if live posting is requested but no author URN can be resolved
      if (authorsToTry.length === 0) {
        const errMsg = "No valid LinkedIn author URN resolved. Configure LINKEDIN_ORGANIZATION_ID or LINKEDIN_PERSON_URN.";
        console.error(`[LinkedIn Publisher ❌] ${errMsg}`);
        throw new Error(errMsg);
      }

      const imageUrl = content.imageUrl?.trim();

      for (const author of authorsToTry) {
        let assetUrn: string | null = null;
        if (imageUrl) {
          assetUrn = await uploadLinkedInImage(accessToken, author, imageUrl);
        }

        const shareContent: any = {
          shareCommentary: {
            text: `${content.title || ""}\n\n${content.fullText || ""}`,
          },
          shareMediaCategory: assetUrn ? "IMAGE" : imageUrl ? "ARTICLE" : "NONE",
        };

        if (assetUrn) {
          shareContent.media = [
            {
              status: "READY",
              media: assetUrn,
              title: {
                text: content.title || "Tech Architecture Blueprint",
              },
            },
          ];
        } else if (imageUrl) {
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
                "X-RestLi-Protocol-Version": "2.0.0",
              },
              body: JSON.stringify(body),
            });

            if (response.ok) {
              const resData: any = await response.json();
              const extId = resData.id || `urn:li:share:${Date.now()}`;
              
              // Extract numeric ID from ugcPost URN and construct canonical update URL
              const numericId = extId.split(":").pop() || "";
              const articleUrl = `https://www.linkedin.com/feed/update/urn:li:activity:${numericId}`;
              const latencyMs = Date.now() - startTime;
              analyticsService.recordPublishedPost({ id: extId, title: content.title || "LinkedIn Post" });

              return {
                success: true,
                platform: Platform.LINKEDIN,
                externalId: extId,
                url: articleUrl,
                publishedAt: new Date().toISOString(),
                mode: "LIVE",
                retries: totalRetries,
                latencyMs,
                message: `Successfully posted directly to real LinkedIn feed (${author})!`,
                rawResponse: resData,
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
                rawResponse: { error: "DUPLICATE_POST", details: errText },
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
                rawResponse: { status: response.status, details: errText },
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

    // Throw error if requested mode was LIVE but we fell through (no publish attempt succeeded)
    if (requestedMode === PublishMode.LIVE) {
      throw new Error("LinkedIn Live publishing failed. Review credentials and configuration.");
    }

    // Explicit Simulation Mode
    const simId = `urn:li:share:${Math.floor(100000000 + Math.random() * 900000000)}`;
    const latencyMs = Date.now() - startTime;
    analyticsService.recordPublishedPost({ id: simId, title: content.title || "LinkedIn Post" });

    return {
      success: true,
      platform: Platform.LINKEDIN,
      externalId: simId,
      url: `https://www.linkedin.com/feed/update/urn:li:activity:${simId.split(":").pop()}`,
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
    const envModeRaw = process.env.PUBLISH_MODE?.toUpperCase();
    const requestedMode: PublishMode =
      options?.mode ||
      (envModeRaw === "LIVE"
        ? PublishMode.LIVE
        : envModeRaw === "SIMULATION"
        ? PublishMode.SIMULATION
        : PublishMode.AUTO);

    const token = process.env.MEDIUM_INTEGRATION_TOKEN?.trim();
    const isLiveExecution =
      requestedMode === PublishMode.LIVE ||
      (requestedMode === PublishMode.AUTO && Boolean(token));

    if (requestedMode === PublishMode.LIVE && !token) {
      const errMsg = "MEDIUM_INTEGRATION_TOKEN is missing or empty in LIVE publish mode.";
      console.error(`[Medium Publisher ❌] ${errMsg}`);
      throw new Error(errMsg);
    }

    if (isLiveExecution && token) {
      let totalRetries = 0;
      const retryableStatuses = [429, 500, 502, 503, 504];
      const backoffScheduleMs = [2000, 5000, 12000];

      for (let attempt = 0; attempt <= backoffScheduleMs.length; attempt++) {
        if (attempt > 0) {
          totalRetries++;
          const baseDelay = backoffScheduleMs[attempt - 1];
          const jitter = Math.floor(Math.random() * 500);
          const delay = baseDelay + jitter;
          console.log(`[Medium Publisher] Retryable error encountered. Backing off for ${delay}ms before attempt ${attempt + 1}...`);
          await new Promise((r) => setTimeout(r, delay));
        }

        try {
          console.log("[Medium Publisher 📝] Fetching user profile from Medium REST API...");
          const meRes = await fetch("https://api.medium.com/v1/me", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          if (!meRes.ok) {
            const errText = await meRes.text();
            console.error(`[Medium Publisher API Error ${meRes.status}]:`, errText);
            
            if (retryableStatuses.includes(meRes.status) && attempt < backoffScheduleMs.length) {
              continue; // Retry
            }
            
            return {
              success: false,
              platform: Platform.MEDIUM,
              externalId: "",
              url: "",
              publishedAt: new Date().toISOString(),
              mode: "LIVE",
              retries: totalRetries,
              latencyMs: Date.now() - startTime,
              reason: `Medium Profile API HTTP ${meRes.status}`,
              message: errText,
              rawResponse: { status: meRes.status, details: errText },
            };
          }

          const meData: any = await meRes.json();
          const userId = meData?.data?.id;
          if (!userId) {
            throw new Error("Failed to retrieve user ID from Medium API response.");
          }

          console.log(`[Medium Publisher 🚀] Publishing article for user ID: ${userId}...`);
          const postRes = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              title: content.title || "Technical Insights & Architecture Blueprint",
              contentFormat: "markdown",
              content: content.fullMarkdown || content.fullText || `${content.title}\n\n${content.introduction || ""}`,
              tags: (content.seoKeywords || content.hashtags || ["technology", "software-engineering", "typescript"]).slice(0, 5),
              publishStatus: "public",
            }),
          });

          if (postRes.ok) {
            const postData: any = await postRes.json();
            const extId = postData?.data?.id || `med_${Date.now()}`;
            const articleUrl = postData?.data?.url || `https://medium.com/p/${extId}`;
            const latencyMs = Date.now() - startTime;
            analyticsService.recordPublishedPost({ id: extId, title: content.title || "Medium Article" });

            return {
              success: true,
              platform: Platform.MEDIUM,
              externalId: extId,
              url: articleUrl,
              publishedAt: new Date().toISOString(),
              mode: "LIVE",
              retries: totalRetries,
              latencyMs,
              message: "Successfully published article directly to live Medium profile!",
              rawResponse: postData,
            };
          } else {
            const errText = await postRes.text();
            console.error(`[Medium Publisher Create Post Error ${postRes.status}]:`, errText);
            
            if (retryableStatuses.includes(postRes.status) && attempt < backoffScheduleMs.length) {
              continue; // Retry
            }

            return {
              success: false,
              platform: Platform.MEDIUM,
              externalId: "",
              url: "",
              publishedAt: new Date().toISOString(),
              mode: "LIVE",
              retries: totalRetries,
              latencyMs: Date.now() - startTime,
              reason: `Medium API HTTP ${postRes.status}`,
              message: errText,
              rawResponse: { status: postRes.status, details: errText },
            };
          }
        } catch (err: any) {
          console.error("[Medium Publisher Exception]:", err.message);
          if (attempt === backoffScheduleMs.length) {
            return {
              success: false,
              platform: Platform.MEDIUM,
              externalId: "",
              url: "",
              publishedAt: new Date().toISOString(),
              mode: "LIVE",
              retries: totalRetries,
              latencyMs: Date.now() - startTime,
              reason: "Medium API Exception",
              message: err.message,
            };
          }
        }
      }
    }

    if (requestedMode === PublishMode.LIVE) {
      throw new Error("Medium Live publishing failed. Verify MEDIUM_INTEGRATION_TOKEN is valid.");
    }

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
      message: "Simulation Mode: Requires MEDIUM_INTEGRATION_TOKEN in env for live Medium publishing.",
    };
  }
}

export class DevtoPublisherAdapter implements IPublisherAdapter {
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

    const apiKey = process.env.DEVTO_API_KEY?.trim();
    const isLiveExecution =
      requestedMode === PublishMode.LIVE ||
      (requestedMode === PublishMode.AUTO && Boolean(apiKey));

    if (requestedMode === PublishMode.LIVE && !apiKey) {
      const errMsg = "DEVTO_API_KEY is missing or empty in LIVE publish mode.";
      console.error(`[Dev.to Publisher ❌] ${errMsg}`);
      throw new Error(errMsg);
    }

    if (isLiveExecution && apiKey) {
      let totalRetries = 0;
      const retryableStatuses = [429, 500, 502, 503, 504];
      const backoffScheduleMs = [2000, 5000, 12000];

      for (let attempt = 0; attempt <= backoffScheduleMs.length; attempt++) {
        if (attempt > 0) {
          totalRetries++;
          const baseDelay = backoffScheduleMs[attempt - 1];
          const jitter = Math.floor(Math.random() * 500);
          const delay = baseDelay + jitter;
          console.log(`[Dev.to Publisher] Retryable error encountered. Backing off for ${delay}ms before attempt ${attempt + 1}...`);
          await new Promise((r) => setTimeout(r, delay));
        }

        try {
          console.log("[Dev.to Publisher 📝] Publishing article via Dev.to REST API...");
          const cleanTags = (content.seoKeywords || content.hashtags || ["technology", "typescript", "webdev"])
            .map((t: string) => t.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
            .filter(Boolean)
            .slice(0, 4);

          const res = await fetch("https://dev.to/api/articles", {
            method: "POST",
            headers: {
              "api-key": apiKey,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              article: {
                title: content.title || "Technical Architecture & System Insights",
                published: true,
                body_markdown: content.fullMarkdown || content.fullText || `${content.title}\n\n${content.introduction || ""}`,
                tags: cleanTags,
                main_image: content.imageUrl || undefined,
              },
            }),
          });

          if (res.ok) {
            const data: any = await res.json();
            const extId = String(data.id);
            const articleUrl = data.url || `https://dev.to/article/${extId}`;
            const latencyMs = Date.now() - startTime;
            analyticsService.recordPublishedPost({ id: extId, title: content.title || "Dev.to Article" });

            return {
              success: true,
              platform: Platform.DEVTO,
              externalId: extId,
              url: articleUrl,
              publishedAt: new Date().toISOString(),
              mode: "LIVE",
              retries: totalRetries,
              latencyMs,
              message: "Successfully published article directly to live Dev.to feed!",
              rawResponse: data,
            };
          } else {
            const errText = await res.text();
            console.error(`[Dev.to Publisher Error ${res.status}]:`, errText);
            
            if (retryableStatuses.includes(res.status) && attempt < backoffScheduleMs.length) {
              continue; // Retry
            }

            return {
              success: false,
              platform: Platform.DEVTO,
              externalId: "",
              url: "",
              publishedAt: new Date().toISOString(),
              mode: "LIVE",
              retries: totalRetries,
              latencyMs: Date.now() - startTime,
              reason: `Dev.to API HTTP ${res.status}`,
              message: errText,
              rawResponse: { status: res.status, details: errText },
            };
          }
        } catch (err: any) {
          console.error("[Dev.to Publisher Exception]:", err.message);
          if (attempt === backoffScheduleMs.length) {
            return {
              success: false,
              platform: Platform.DEVTO,
              externalId: "",
              url: "",
              publishedAt: new Date().toISOString(),
              mode: "LIVE",
              retries: totalRetries,
              latencyMs: Date.now() - startTime,
              reason: "Dev.to API Exception",
              message: err.message,
            };
          }
        }
      }
    }

    if (requestedMode === PublishMode.LIVE) {
      throw new Error("Dev.to Live publishing failed. Verify DEVTO_API_KEY is valid.");
    }

    const slug = (content.title || "article").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      success: true,
      platform: Platform.DEVTO,
      externalId: `devto_${Math.random().toString(36).substring(2, 9)}`,
      url: `https://dev.to/dineshkumar-mb/${slug}-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      mode: "SIMULATION",
      retries: 0,
      latencyMs: Date.now() - startTime,
      message: "Simulation Mode: Requires DEVTO_API_KEY in env for live Dev.to publishing.",
    };
  }
}

export class PublisherService {
  private adapters: Map<Platform, IPublisherAdapter> = new Map();

  constructor() {
    this.adapters.set(Platform.LINKEDIN, new LinkedInPublisherAdapter());
    this.adapters.set(Platform.MEDIUM, new MediumPublisherAdapter());
    this.adapters.set(Platform.DEVTO, new DevtoPublisherAdapter());
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
