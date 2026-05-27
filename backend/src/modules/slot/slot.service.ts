import prisma from "../../config/database";
import redis from "../../config/redis";
import { generateSlots } from "../../utils/slot.generator";

interface SlotResponse {
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "RESERVED" | "BOOKED";
}

export async function getAvailableSlots(pitchId: string, date: string): Promise<SlotResponse[]> {
  const slots = generateSlots(date);

  const bookings = await prisma.booking.findMany({
    where: {
      pitchId,
      bookingDate: new Date(date),
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    select: { startTime: true, status: true },
  });

  const bookedTimes = new Map<string, string>();
  for (const booking of bookings) {
    bookedTimes.set(booking.startTime.toISOString(), booking.status);
  }

  const result: SlotResponse[] = [];

  for (const slot of slots) {
    const slotKey = slot.startTime.toISOString();
    const bookingStatus = bookedTimes.get(slotKey);

    if (bookingStatus === "CONFIRMED") {
      result.push({ startTime: slotKey, endTime: slot.endTime.toISOString(), status: "BOOKED" });
      continue;
    }

    if (bookingStatus === "PENDING") {
      result.push({ startTime: slotKey, endTime: slot.endTime.toISOString(), status: "BOOKED" });
      continue;
    }

    const redisKey = `reservation:${pitchId}:${date}:${slotKey}`;
    const reserved = await redis.get(redisKey);

    if (reserved) {
      result.push({ startTime: slotKey, endTime: slot.endTime.toISOString(), status: "RESERVED" });
    } else {
      result.push({ startTime: slotKey, endTime: slot.endTime.toISOString(), status: "AVAILABLE" });
    }
  }

  return result;
}
