/*
  Warnings:

  - Added the required column `value` to the `PayWith` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PayWith" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;
