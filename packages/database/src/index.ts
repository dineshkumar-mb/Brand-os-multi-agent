import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";
const isProd = typeof process !== "undefined" && process.env.NODE_ENV === "production";

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: isDev ? ["query", "error", "warn"] : ["error"],
  });

if (!isProd) {
  globalThis.prismaGlobal = prisma;
}

export * from "@prisma/client";
