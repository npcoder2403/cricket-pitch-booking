import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";
import redis from "../config/redis";
import { sendResponse } from "../utils/api.response";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse({ res, statusCode: 401, success: false, message: "Token required" });
  }

  const token = authHeader.split(" ")[1];

  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    return sendResponse({ res, statusCode: 401, success: false, message: "Token has been revoked" });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    return sendResponse({ res, statusCode: 401, success: false, message: "Invalid or expired token" });
  }
}
