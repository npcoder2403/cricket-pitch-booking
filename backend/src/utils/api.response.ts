import { Response } from "express";

interface ApiResponseParams {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: unknown;
}

export function sendResponse({ res, statusCode, success, message, data }: ApiResponseParams) {
  return res.status(statusCode).json({
    success,
    message,
    data: data || null,
    statusCode,
  });
}
