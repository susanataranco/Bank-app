import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateCustomUserId } from "../../utils/generateCustomUserId.js";

const router = Router();
const prisma = new PrismaClient();

// Create or fetch a user
router.post("/", async (req, res) => {
  const { email, clerkId } = req.body;

  if (!email || !clerkId) {
    return res.status(400).json({ error: "Missing email or Clerk ID" });
  }

  try {
    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user doesn't exist, create them
    if (!user) {
      // Generate a unique customUserId
      let customUserId: string = "";
      let isUnique = false;

      while (!isUnique) {
        customUserId = generateCustomUserId() || "AAA-00000000";
        const existingUser = await prisma.user.findUnique({
          where: { customUserId },
        });
        if (!existingUser) {
          isUnique = true;
        }
      }

      user = await prisma.user.create({
        data: {
          email,
          password: "",
          clerkId,
          customUserId,
        },
      });
    }

    res.status(200).json({ accountId: user.customUserId });
  } catch (error) {
    console.error("Error creating or fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:accountId/balance", async (req, res) => {
  const { accountId } = req.params;

  try {
    // Find the user by customUserId
    const user = await prisma.user.findUnique({
      where: { customUserId: accountId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Calculate the total balance
    const balance = await prisma.transaction.aggregate({
      where: { userId: user.id },
      _sum: { amount: true },
    });

    res.status(200).json({ balance: balance._sum.amount || 0 });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

