import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/api.response";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return sendResponse({
      res,
      statusCode: err.statusCode,
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return sendResponse({
    res,
    statusCode: 500,
    success: false,
    message: "Internal server error",
  });
}
