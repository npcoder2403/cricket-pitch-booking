import { Request, Response, NextFunction } from "express";
import { getAvailableSlots } from "./slot.service";
import { getSlotSchema } from "./slot.schema";
import { sendResponse } from "../../utils/api.response";

export async function getSlots(req: Request, res: Response, next: NextFunction) {
  try {
    const result = getSlotSchema.safeParse(req.query);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(", ");
      return sendResponse({ res, statusCode: 400, success: false, message });
    }

    const { pitchId, date } = result.data;
    const slots = await getAvailableSlots(pitchId, date);
    sendResponse({ res, statusCode: 200, success: true, message: "Slots fetched", data: slots });
  } catch (err) {
    next(err);
  }
}
