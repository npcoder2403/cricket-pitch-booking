import { Request, Response, NextFunction } from "express";
import { getAllPitches, getPitchById } from "./pitch.service";
import { sendResponse } from "../../utils/api.response";
import { AppError } from "../../middlewares/error.middleware";

export async function listPitches(_req: Request, res: Response, next: NextFunction) {
  try {
    const pitches = await getAllPitches();
    sendResponse({ res, statusCode: 200, success: true, message: "Pitches fetched", data: pitches });
  } catch (err) {
    next(err);
  }
}

export async function getPitch(req: Request, res: Response, next: NextFunction) {
  try {
    const pitch = await getPitchById(req.params.id);
    if (!pitch) throw new AppError("Pitch not found", 404);
    sendResponse({ res, statusCode: 200, success: true, message: "Pitch fetched", data: pitch });
  } catch (err) {
    next(err);
  }
}
