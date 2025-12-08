/*
  Warnings:

  - You are about to drop the column `durationDays` on the `RoomType` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerNight` on the `RoomType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoomType" DROP COLUMN "durationDays",
DROP COLUMN "pricePerNight",
ADD COLUMN     "packagePrice" DOUBLE PRECISION;
