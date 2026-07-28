import { describe, it, expect, beforeEach, vi } from "vitest";
import { LinkedInPublisherAdapter, MissingAccessTokenError, MediumPublisherAdapter } from "../index";
import { Platform } from "@brand-os/shared";

describe("Publisher Adaptors & Failover Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should throw MissingAccessTokenError in LinkedIn LIVE mode when credentials are missing", async () => {
    delete process.env.LINKEDIN_ACCESS_TOKEN;
    const adapter = new LinkedInPublisherAdapter();
    
    await expect(
      adapter.publishPost({ title: "Test Title", fullText: "Test body" }, { mode: "LIVE" as any })
    ).rejects.toThrow(MissingAccessTokenError);
  });

  it("should format LinkedIn activity URLs correctly and preserve raw responses", async () => {
    process.env.LINKEDIN_ACCESS_TOKEN = "valid_linkedin_oauth_access_token_value_of_good_length";
    process.env.LINKEDIN_PERSON_URN = "urn:li:person:12345";

    const mockResponsePayload = { id: "urn:li:ugcPost:888777666" };

    // Mock fetch for profile endpoint and ugcPosts post request
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("userinfo") || url.includes("/me")) {
        return { ok: true, json: async () => ({ sub: "12345" }) };
      }
      if (url.includes("ugcPosts")) {
        return {
          ok: true,
          json: async () => mockResponsePayload,
        };
      }
      return { ok: true, json: async () => ({}) };
    });
    global.fetch = mockFetch;

    const adapter = new LinkedInPublisherAdapter();
    const result = await adapter.publishPost({ title: "My Tech Post", fullText: "Short body here..." }, { mode: "LIVE" as any });

    expect(result.success).toBe(true);
    expect(result.externalId).toBe("urn:li:ugcPost:888777666");
    expect(result.url).toBe("https://www.linkedin.com/feed/update/urn:li:activity:888777666");
    expect(result.rawResponse).toEqual(mockResponsePayload);
  });

  it("should gracefully trigger retries on 500 status code for Medium publishing", async () => {
    process.env.MEDIUM_INTEGRATION_TOKEN = "valid_medium_token_format_val";
    
    let attemptsCount = 0;
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("v1/me")) {
        return { ok: true, json: async () => ({ data: { id: "user_med_id" } }) };
      }
      if (url.includes("users/user_med_id/posts")) {
        attemptsCount++;
        if (attemptsCount === 1) {
          return { ok: false, status: 502, text: async () => "Bad Gateway" };
        }
        return {
          ok: true,
          json: async () => ({ data: { id: "post_111", url: "https://medium.com/p/post_111" } }),
        };
      }
      return { ok: true };
    });
    global.fetch = mockFetch;

    const adapter = new MediumPublisherAdapter();
    const result = await adapter.publishPost({ title: "My Medium Article", fullMarkdown: "Technical description" }, { mode: "LIVE" as any });

    expect(result.success).toBe(true);
    expect(attemptsCount).toBe(2);
    expect(result.retries).toBe(1);
    expect(result.externalId).toBe("post_111");
  });
});
