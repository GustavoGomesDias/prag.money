-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "current_month" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "has_added" BOOLEAN NOT NULL DEFAULT true;
