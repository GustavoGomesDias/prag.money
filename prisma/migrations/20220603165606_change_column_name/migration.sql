/*
  Warnings:

  - You are about to drop the column `additional_value` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "additional_value",
ADD COLUMN     "current_value" DECIMAL(65,30) NOT NULL DEFAULT 0;
