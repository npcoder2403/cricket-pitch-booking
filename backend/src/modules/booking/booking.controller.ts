import { Request, Response, NextFunction } from "express";
import { reserveSlot, confirmBooking, cancelReservation, getUserBookings } from "./booking.service";
import { sendResponse } from "../../utils/api.response";

export async function reserve(req: Request, res: Response, next: NextFunction) {
  try {
    const { pitchId, date, startTime } = req.body;
    const result = await reserveSlot(req.user!.sub, pitchId, date, startTime);
    sendResponse({ res, statusCode: 200, success: true, message: "Slot reserved for 2 minutes", data: result });
  } catch (err) {
    next(err);
  }
}

export async function confirm(req: Request, res: Response, next: NextFunction) {
  try {
    const { pitchId, date, startTime } = req.body;
    const booking = await confirmBooking(req.user!.sub, pitchId, date, startTime);
    sendResponse({ res, statusCode: 200, success: true, message: "Booking confirmed", data: booking });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const { pitchId, date, startTime } = req.body;
    await cancelReservation(req.user!.sub, pitchId, date, startTime);
    sendResponse({ res, statusCode: 200, success: true, message: "Reservation cancelled" });
  } catch (err) {
    next(err);
  }
}

export async function myBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const bookings = await getUserBookings(req.user!.sub);
    sendResponse({ res, statusCode: 200, success: true, message: "Bookings fetched", data: bookings });
  } catch (err) {
    next(err);
  }
}
