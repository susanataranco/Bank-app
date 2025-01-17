import { PrismaClient } from "@prisma/client";
import { generateCustomUserId } from "../src/utils/generateCustomUserId.js";

const prisma = new PrismaClient();

async function populateCustomUserId() {
  const users = await prisma.user.findMany({
    where: {
      customUserId: null,
    },
  });

  for (const user of users) {
    let customUserId;
    let isUnique = false;

    while (!isUnique) {
      customUserId = generateCustomUserId();
      const existingUser = await prisma.user.findUnique({
        where: { customUserId },
      });
      if (!existingUser) {
        isUnique = true;
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { customUserId },
    });

    console.log(`Updated user ${user.email} with ID ${customUserId}`);
  }
}

populateCustomUserId()
  .then(() => {
    console.log("Finished updating users.");
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });
