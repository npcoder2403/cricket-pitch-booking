import { z } from "zod";

export const getSlotSchema = z.object({
  pitchId: z.string().uuid("Invalid pitch ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});
