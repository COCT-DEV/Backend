/*
  Warnings:

  - Changed the type of `hymn_number` on the `Hymn` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Hymn" DROP COLUMN "hymn_number",
ADD COLUMN     "hymn_number" INTEGER NOT NULL;
