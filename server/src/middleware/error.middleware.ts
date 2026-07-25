import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error(`[API Error] ${req.method} ${req.path}:`, err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
}
