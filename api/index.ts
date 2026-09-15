import app from "../server/src/main";

export default async function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error("[Vercel API Handler Exception]:", err);
    if (!res.headersSent) {
      res.status(500).json({
        error: err?.message || "Internal Server Error",
        timestamp: new Date().toISOString(),
      });
    }
  }
}

