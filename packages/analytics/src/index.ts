export interface DashboardSummary {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgCTR: number;
  totalFollowersGained: number;
  topPerformingHooks: string[];
  lowestPerformingTopics: string[];
  learningRecommendations: string[];
}

export class AnalyticsService {
  public getSummary(): DashboardSummary {
    return {
      totalViews: 148200,
      totalLikes: 12450,
      totalComments: 1890,
      totalShares: 940,
      avgCTR: 4.85,
      totalFollowersGained: 1280,
      topPerformingHooks: [
        "Stop writing repetitive state hooks in React. React 19 changes everything.",
        "Why 90% of microservices fail at scale — and how event-driven architecture fixes it.",
        "Building a production AI Gateway in TypeScript: Latency, Cost, and Failovers.",
      ],
      lowestPerformingTopics: ["Basic CSS selectors overview", "Generic agile meeting tips"],
      learningRecommendations: [
        "Increase post technical depth by including concrete TypeScript code snippets.",
        "Posts published at 08:30 AM EST achieve 42% higher initial engagement.",
        "Add carousel visual architecture diagrams to double comment rate.",
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
