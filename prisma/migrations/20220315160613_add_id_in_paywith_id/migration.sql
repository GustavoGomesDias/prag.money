-- DropIndex
DROP INDEX "PayWith_id_key";

-- AlterTable
ALTER TABLE "PayWith" ADD CONSTRAINT "PayWith_pkey" PRIMARY KEY ("id");
