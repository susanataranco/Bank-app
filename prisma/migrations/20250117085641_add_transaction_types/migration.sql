/*
  Warnings:

  - Added the required column `transactionType` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "toAccountId" TEXT,
ADD COLUMN     "transactionType" TEXT NOT NULL;
