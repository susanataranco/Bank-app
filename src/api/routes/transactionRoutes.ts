import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Fetch transactions for a user
router.get("/:accountId", async (req, res) => {
  const { accountId } = req.params;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        user: {
          customUserId: accountId,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ error: "No transactions found." });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new transaction
router.post("/", async (req, res) => {
  const { accountId, amount, transactionType, toAccountId } = req.body;

  if (!accountId || !amount || !transactionType ||
    (transactionType === "transfer_to" && !toAccountId)) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

  try {
    console.log(`Processing transaction for accountId: ${accountId}`);
    console.log(`Request payload:`, { accountId, amount, transactionType, toAccountId });

    // Find the user by customUserId
    const user = await prisma.user.findUnique({
      where: { customUserId: accountId },
    });

    if (!user) {
      console.log(`User with accountId ${accountId} not found.`);
      return res.status(404).json({ error: "User not found." });
    }

    console.log(`User found: ${user.email}`);

    // Withdrawal logic
    if (transactionType === "withdrawal") {
      const balance = await prisma.transaction.aggregate({
        where: { userId: user.id },
        _sum: { amount: true },
      });

      console.log(`Current balance: ${balance._sum.amount || 0}`);

      if ((balance._sum.amount || 0) < amount) {
        return res.status(400).json({ error: "Insufficient funds." });
      }

      const transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: -Math.abs(amount),
          transactionType,
        },
      });

      console.log(`Withdrawal transaction created: ${transaction.id}`);
      return res.status(201).json(transaction);
    }

    // Transfer logic
    if (transactionType === "transfer_to") {
      if (!toAccountId) {
        return res.status(400).json({ error: "Missing toAccountId for transfer." });
      }

      const recipient = await prisma.user.findUnique({
        where: { customUserId: toAccountId },
      });

      if (!recipient) {
        return res.status(404).json({ error: "Recipient account not found." });
      }

      console.log(`Recipient found: ${recipient.email}`);

      const senderTransaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: -Math.abs(amount),
          transactionType,
          toAccountId,
        },
      });

      console.log(`Sender transaction created: ${senderTransaction.id}`);

      await prisma.transaction.create({
        data: {
          userId: recipient.id,
          amount: Math.abs(amount),
          transactionType: "transfer_from",
          toAccountId: accountId,
        },
      });

      console.log(`Recipient transaction created.`);
      return res.status(201).json(senderTransaction);
    }

    // Deposit logic
    if (transactionType === "deposit") {
      const transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: Math.abs(amount),
          transactionType,
        },
      });
    
      console.log(`Deposit transaction created: ${transaction.id}`);
      return res.status(201).json(transaction);
    }

  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
