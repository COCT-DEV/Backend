/*
  Warnings:

  - Added the required column `address` to the `ChurchLocations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `ChurchLocations` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `map_url` on the `ChurchLocations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ChurchLocations" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
DROP COLUMN "map_url",
ADD COLUMN     "map_url" TEXT NOT NULL;
