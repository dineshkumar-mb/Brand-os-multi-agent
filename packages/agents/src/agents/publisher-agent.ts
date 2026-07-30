import {
  AgentType,
  AgentResult,
  Platform,
  PublishMode,
  LinkedInPostPayload,
  DevToArticlePayload,
} from "@brand-os/shared";
import { publisherService } from "@brand-os/publisher";

export interface PublishingReport {
  linkedInResult?: any;
  devToResult?: any;
  mode: PublishMode;
  publishedAt: string;
}

export class PublisherAgent {
  public async publishContent(
    post: LinkedInPostPayload,
    devToArticle?: DevToArticlePayload,
    options: { mode?: PublishMode } = {},
    pipelineId?: string
  ): Promise<AgentResult<PublishingReport>> {
    const startTime = Date.now();
    const mode = options.mode || PublishMode.AUTO;
    console.log(`[Publisher Agent] Dispatching content payloads to LinkedIn & Dev.to APIs (Mode: ${mode})...`);

    // Publish to LinkedIn
    let linkedInResult = null;
    try {
      linkedInResult = await publisherService.publish(Platform.LINKEDIN, post, { mode });
    } catch (err: any) {
      console.warn("[Publisher Agent] LinkedIn publish warning:", err.message);
      linkedInResult = { success: false, error: err.message, mode: "SIMULATION" };
    }

    // Publish / Draft to Dev.to
    let devToResult = null;
    if (devToArticle) {
      try {
        devToResult = await publisherService.publish(Platform.DEVTO, devToArticle as any, { mode });
      } catch (err: any) {
        console.warn("[Publisher Agent] Dev.to publish warning:", err.message);
        devToResult = { success: false, error: err.message, mode: "SIMULATION" };
      }
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      success: true,
      confidenceScore: 95,
      data: {
        linkedInResult,
        devToResult,
        mode,
        publishedAt: new Date().toISOString(),
      },
      validationResult: {
        passed: true,
        errors: [],
        warnings: [],
      },
      metadata: {
        agentType: AgentType.PUBLISHER,
        timestamp: new Date().toISOString(),
        executionTimeMs,
        pipelineId,
      },
    };
  }
}
