/*
  Warnings:

  - The primary key for the `Hymn` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `HymnVersion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hymnVerId` on the `HymnVersion` table. All the data in the column will be lost.
  - You are about to drop the column `hymn_version` on the `HymnVersion` table. All the data in the column will be lost.
  - The required column `id` was added to the `HymnVersion` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `version` to the `HymnVersion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Version" AS ENUM ('ENGLISH', 'TWI');

-- DropForeignKey
ALTER TABLE "HymnVersion" DROP CONSTRAINT "HymnVersion_hymn_id_fkey";

-- AlterTable
ALTER TABLE "Hymn" DROP CONSTRAINT "Hymn_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Hymn_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Hymn_id_seq";

-- AlterTable
ALTER TABLE "HymnVersion" DROP CONSTRAINT "HymnVersion_pkey",
DROP COLUMN "hymnVerId",
DROP COLUMN "hymn_version",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "version" "Version" NOT NULL,
ALTER COLUMN "hymn_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "HymnVersion_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "version";

-- AddForeignKey
ALTER TABLE "HymnVersion" ADD CONSTRAINT "HymnVersion_hymn_id_fkey" FOREIGN KEY ("hymn_id") REFERENCES "Hymn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
