import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  databaseUrl: process.env.DATABASE_URL || "",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  jwtSecret: process.env.JWT_SECRET || "fallback-secret",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrls: (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((u) => u.trim()),
};
