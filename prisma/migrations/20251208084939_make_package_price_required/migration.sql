/*
  Warnings:

  - Made the column `packagePrice` on table `RoomType` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RoomType" ALTER COLUMN "packagePrice" SET NOT NULL;
