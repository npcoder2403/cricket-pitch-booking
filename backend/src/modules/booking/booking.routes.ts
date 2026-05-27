import { Router } from "express";
import { reserve, confirm, cancel, myBookings } from "./booking.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { reserveSlotSchema, confirmBookingSchema, cancelReservationSchema } from "./booking.schema";

const router = Router();

router.post("/reserve-slot", authMiddleware, validate(reserveSlotSchema), reserve);
router.post("/confirm-booking", authMiddleware, validate(confirmBookingSchema), confirm);
router.post("/cancel-reservation", authMiddleware, validate(cancelReservationSchema), cancel);
router.get("/my-bookings", authMiddleware, myBookings);

export default router;
