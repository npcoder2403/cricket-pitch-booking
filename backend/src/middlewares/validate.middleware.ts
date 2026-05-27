import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendResponse } from "../utils/api.response";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(", ");
      return sendResponse({ res, statusCode: 400, success: false, message });
    }

    req.body = result.data;
    next();
  };
}
