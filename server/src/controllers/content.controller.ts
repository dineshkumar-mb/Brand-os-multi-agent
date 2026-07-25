import { Request, Response } from "express";
import { Platform, PostStatus } from "@brand-os/shared";

export class ContentController {
  public getPosts(_req: Request, res: Response) {
    res.json({
      posts: [
        {
          id: "post_101",
          platform: Platform.LINKEDIN,
          title: "React 19 Actions & Compiler Optimization",
          hook: "Stop writing repetitive state hooks in React. React 19 changes everything.",
          fullText: "Stop writing repetitive state hooks in React. React 19 changes everything. 🚀\n\nLast month, our team evaluated React 19's new Compiler and Actions API on an enterprise platform codebase.\n\nThe results? 90% less boilerplate.\n\nActionable Takeaways:\n1. Leverage useActionState for form handling\n2. Use optimistic UI updates via useOptimistic\n3. Decouple backend tasks with Redis",
          status: PostStatus.PENDING_REVIEW,
          evaluationScore: 93.2,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }

  public getArticles(_req: Request, res: Response) {
    res.json({
      articles: [
        {
          id: "art_201",
          platform: Platform.MEDIUM,
          title: "React 19 Actions & Compiler Optimization: The Definitive Enterprise Guide",
          subtitle: "A comprehensive deep dive into architecture, code examples, best practices, and performance benchmarks.",
          readingTimeMinutes: 8,
          status: PostStatus.APPROVED,
          evaluationScore: 95.8,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }
}

export const contentController = new ContentController();
