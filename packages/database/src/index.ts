declare global {
  var prismaGlobal: any;
}

const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";
const isProd = typeof process !== "undefined" && process.env.NODE_ENV === "production";

let prismaInstance: any = null;

try {
  const prismaModule = require("@prisma/client");
  if (prismaModule && prismaModule.PrismaClient) {
    prismaInstance =
      globalThis.prismaGlobal ??
      new prismaModule.PrismaClient({
        log: isDev ? ["query", "error", "warn"] : ["error"],
      });

    if (!isProd && prismaInstance) {
      globalThis.prismaGlobal = prismaInstance;
    }
  }
} catch (e: any) {
  console.warn("[Prisma Client Init Notice] Database client offline or not generated:", e?.message);
}

export const prisma = prismaInstance;



