import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.pitch.createMany({
    data: [
      {
        name: "Turf Ground",
        location: "Sports Complex, Sector 21",
        pricePerHour: 1500,
      },
      {
        name: "Box Cricket",
        location: "Green Park, MG Road",
        pricePerHour: 800,
      },
      {
        name: "Indoor Nets",
        location: "City Stadium, Ring Road",
        pricePerHour: 600,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded 3 pitches successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
