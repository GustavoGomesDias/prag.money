/*
  Warnings:

  - You are about to drop the column `reset_date` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `defalut_value` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Added the required column `reset_day` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reset_month` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "reset_date",
ADD COLUMN     "reset_day" INTEGER NOT NULL,
ADD COLUMN     "reset_month" INTEGER NOT NULL,
ALTER COLUMN "defalut_value" SET DATA TYPE DECIMAL(65,30);
