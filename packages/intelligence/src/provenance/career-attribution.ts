import { ContentOpportunity } from "@brand-os/shared";

export interface CareerAttributionRecord {
  id: string;
  postId: string;
  opportunityId: string;
  topic: string;
  publishedAt: string;
  profileVisits: number;
  recruiterConnections: number;
  interviewInquiries: number;
  hiringManagerEngagements: number;
  careerImpactScore: number; // 0 - 100
}

export class CareerAttributionEngine {
  private records: CareerAttributionRecord[] = [
    {
      id: "attr_1",
      postId: "post_182",
      opportunityId: "opp_ai_gateway",
      topic: "Building Production Multi-Model AI Gateways with MCP Failover Routing",
      publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      profileVisits: 142,
      recruiterConnections: 12,
      interviewInquiries: 3,
      hiringManagerEngagements: 5,
      careerImpactScore: 96,
    },
    {
      id: "attr_2",
      postId: "post_183",
      opportunityId: "opp_redis_streams",
      topic: "Decoupled Event-Driven Microservices with Redis Streams & BullMQ",
      publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      profileVisits: 89,
      recruiterConnections: 6,
      interviewInquiries: 1,
      hiringManagerEngagements: 2,
      careerImpactScore: 88,
    },
  ];

  public recordAttribution(record: Omit<CareerAttributionRecord, "id" | "careerImpactScore">): CareerAttributionRecord {
    // Calculate Career Impact Score based on recruiter connections, interviews, and profile visits
    const careerImpactScore = Math.min(
      100,
      Math.round(
        record.profileVisits * 0.15 +
        record.recruiterConnections * 3.0 +
        record.interviewInquiries * 8.0 +
        record.hiringManagerEngagements * 5.0
      )
    );

    const newRecord: CareerAttributionRecord = {
      ...record,
      id: `attr_${Date.now()}`,
      careerImpactScore,
    };

    this.records.push(newRecord);
    console.log(
      `[Career Attribution Engine] Recorded high-signal career outcome for "${record.topic}" with Impact Score: ${careerImpactScore}/100.`
    );
    return newRecord;
  }

  public getAttributionRecords(): CareerAttributionRecord[] {
    return this.records;
  }

  public getHighImpactTopics(): string[] {
    return this.records
      .filter((r) => r.careerImpactScore >= 85)
      .map((r) => r.topic);
  }

  public calculateAttributionRate(): {
    totalPosts: number;
    meaningfulOpportunityPosts: number;
    attributionRatePercentage: number;
  } {
    const totalPosts = this.records.length;
    const meaningfulOpportunityPosts = this.records.filter(
      (r) => r.interviewInquiries > 0 || r.recruiterConnections >= 3 || r.hiringManagerEngagements >= 2
    ).length;
    const attributionRatePercentage =
      totalPosts > 0
        ? parseFloat(((meaningfulOpportunityPosts / totalPosts) * 100).toFixed(1))
        : 0;

    return {
      totalPosts,
      meaningfulOpportunityPosts,
      attributionRatePercentage,
    };
  }
}

export const careerAttributionEngine = new CareerAttributionEngine();
