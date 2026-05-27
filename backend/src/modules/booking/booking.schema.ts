import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const reserveSlotSchema = z.object({
  pitchId: z.string().uuid("Invalid pitch ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").refine((val) => {
    return new Date(val) >= today;
  }, "Cannot book in the past"),
  startTime: z.string(),
});

export const confirmBookingSchema = z.object({
  pitchId: z.string().uuid("Invalid pitch ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z.string(),
});

export const cancelReservationSchema = z.object({
  pitchId: z.string().uuid("Invalid pitch ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z.string(),
});
