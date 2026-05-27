import Queue from "bull";
import redis from "../config/redis";
import { getIO } from "../config/socket";
import { config } from "../config";

interface ReservationJobData {
  pitchId: string;
  date: string;
  startTime: string;
}

let reservationQueue: Queue.Queue<ReservationJobData>;

export function initReservationQueue(): Queue.Queue<ReservationJobData> {
  reservationQueue = new Queue<ReservationJobData>("reservation-expiry", config.redisUrl);

  reservationQueue.process(async (job) => {
    const { pitchId, date, startTime } = job.data;
    const redisKey = `reservation:${pitchId}:${date}:${startTime}`;

    const exists = await redis.get(redisKey);
    if (exists) {
      await redis.del(redisKey);

      const io = getIO();
      io.to(`pitch:${pitchId}`).emit("slot:released", { pitchId, date, startTime });
    }
  });

  return reservationQueue;
}

export function getReservationQueue(): Queue.Queue<ReservationJobData> {
  return reservationQueue;
}
