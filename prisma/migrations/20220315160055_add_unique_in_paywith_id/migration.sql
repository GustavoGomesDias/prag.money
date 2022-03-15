-- AlterTable
CREATE SEQUENCE "paywith_id_seq";
ALTER TABLE "PayWith" ALTER COLUMN "id" SET DEFAULT nextval('paywith_id_seq');
ALTER SEQUENCE "paywith_id_seq" OWNED BY "PayWith"."id";
