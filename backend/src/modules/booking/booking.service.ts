import prisma from "../../config/database";
import redis from "../../config/redis";
import { AppError } from "../../middlewares/error.middleware";
import { getIO } from "../../config/socket";
import { getReservationQueue } from "../../jobs/reservation.expiry.job";

const RESERVATION_TTL = 120;

export async function reserveSlot(userId: string, pitchId: string, date: string, startTime: string) {
  const redisKey = `reservation:${pitchId}:${date}:${startTime}`;

  const set = await redis.set(redisKey, userId, "EX", RESERVATION_TTL, "NX");

  if (!set) {
    throw new AppError("Slot already taken", 409);
  }

  const queue = getReservationQueue();
  const job = await queue.add(
    { pitchId, date, startTime },
    { delay: RESERVATION_TTL * 1000, jobId: redisKey }
  );

  const io = getIO();
  const reservedUntil = new Date(Date.now() + RESERVATION_TTL * 1000).toISOString();
  io.to(`pitch:${pitchId}`).emit("slot:reserved", { pitchId, date, startTime, reservedUntil });

  return { reservedUntil, jobId: job.id };
}

export async function confirmBooking(userId: string, pitchId: string, date: string, startTime: string) {
  const redisKey = `reservation:${pitchId}:${date}:${startTime}`;

  const holder = await redis.get(redisKey);
  if (holder && holder !== userId) {
    throw new AppError("Slot reserved by another user", 409);
  }

  const startDate = new Date(startTime);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  const bookingDate = new Date(date);

  const existing = await prisma.booking.findFirst({
    where: {
      userId,
      pitchId,
      bookingDate,
      startTime: startDate,
      status: { in: ["CONFIRMED", "PENDING"] },
    },
  });

  if (existing) {
    return existing;
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      await tx.$queryRawUnsafe(
        `SELECT id FROM "Booking" WHERE "pitchId" = $1 AND "bookingDate" = $2 AND "startTime" = $3 FOR UPDATE`,
        pitchId,
        bookingDate,
        startDate
      );

      return tx.booking.create({
        data: {
          userId,
          pitchId,
          bookingDate,
          startTime: startDate,
          endTime: endDate,
          status: "CONFIRMED",
        },
        include: { pitch: { select: { name: true } } },
      });
    });

    await redis.del(redisKey);

    const queue = getReservationQueue();
    const job = await queue.getJob(redisKey);
    if (job) await job.remove();

    const io = getIO();
    io.to(`pitch:${pitchId}`).emit("slot:booked", { pitchId, date, startTime });

    return booking;
  } catch (err: unknown) {
    const error = err as { code?: string };
    if (error.code === "P2002") {
      throw new AppError("Slot already taken", 409);
    }
    throw err;
  }
}

export async function cancelReservation(userId: string, pitchId: string, date: string, startTime: string) {
  const redisKey = `reservation:${pitchId}:${date}:${startTime}`;

  const holder = await redis.get(redisKey);
  if (holder !== userId) {
    throw new AppError("No active reservation found", 404);
  }

  await redis.del(redisKey);

  const queue = getReservationQueue();
  const job = await queue.getJob(redisKey);
  if (job) await job.remove();

  const io = getIO();
  io.to(`pitch:${pitchId}`).emit("slot:released", { pitchId, date, startTime });
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: { pitch: { select: { name: true, location: true, pricePerHour: true } } },
    orderBy: { createdAt: "desc" },
  });
}
