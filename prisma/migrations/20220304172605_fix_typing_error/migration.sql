/*
  Warnings:

  - You are about to drop the column `defalut_value` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `default_value` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "defalut_value",
ADD COLUMN     "default_value" DECIMAL(65,30) NOT NULL;
