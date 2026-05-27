import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthPayload } from "../types/express";

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, config.jwtSecret) as AuthPayload;
}

export function getTokenExpiry(token: string): number {
  const decoded = jwt.decode(token) as { exp?: number };
  if (!decoded?.exp) return 0;
  return decoded.exp - Math.floor(Date.now() / 1000);
}
