import prisma from "../../config/database";

export async function getAllPitches() {
  return prisma.pitch.findMany({
    select: { id: true, name: true, location: true, pricePerHour: true },
  });
}

export async function getPitchById(id: string) {
  return prisma.pitch.findUnique({
    where: { id },
    select: { id: true, name: true, location: true, pricePerHour: true },
  });
}
