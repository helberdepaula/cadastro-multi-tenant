/*
  Warnings:

  - The `publicId` column on the `cliente` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."cliente" DROP COLUMN "publicId",
ADD COLUMN     "publicId" SERIAL NOT NULL;
