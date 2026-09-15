import type { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";
const isProd = typeof process !== "undefined" && process.env.NODE_ENV === "production";

let prismaInstance: PrismaClient | null = null;

try {
  const { PrismaClient: PrismaClientClass } = require("@prisma/client");
  prismaInstance =
    globalThis.prismaGlobal ??
    new PrismaClientClass({
      log: isDev ? ["query", "error", "warn"] : ["error"],
    });

  if (!isProd && prismaInstance) {
    globalThis.prismaGlobal = prismaInstance;
  }
} catch (e: any) {
  console.warn("[Prisma Client Init Notice] Database client offline or not generated:", e?.message);
}

export const prisma = prismaInstance as PrismaClient;
export * from "@prisma/client";


