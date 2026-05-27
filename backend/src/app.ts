import express from "express";
import cors from "cors";
import { config } from "./config";
import authRoutes from "./modules/auth/auth.routes";
import pitchRoutes from "./modules/pitch/pitch.routes";
import slotRoutes from "./modules/slot/slot.routes";
import bookingRoutes from "./modules/booking/booking.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: config.frontendUrls,
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/pitches", pitchRoutes);
app.use("/slots", slotRoutes);
app.use("/", bookingRoutes);

app.use(errorMiddleware);

export default app;
