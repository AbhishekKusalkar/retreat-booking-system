-- Migration: Add Package System to Retreat Booking System
-- This script safely adds the new Package system without losing existing data

-- Step 1: Create Package table
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "retreatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pricePerNight" DOUBLE PRECISION NOT NULL,
    "durationDays" INTEGER NOT NULL DEFAULT 6,
    "maxGuests" INTEGER NOT NULL,
    "amenities" TEXT[],
    "inclusions" TEXT[],
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- Step 2: Add packageId and durationDays to RoomType if they don't exist
ALTER TABLE "RoomType"
ADD COLUMN IF NOT EXISTS "packageId" TEXT,
ADD COLUMN IF NOT EXISTS "durationDays" INTEGER NOT NULL DEFAULT 6;

-- Step 3: Create indexes for Package table
CREATE INDEX "Package_retreatId_idx" ON "Package"("retreatId");
CREATE UNIQUE INDEX "Package_retreatId_name_key" ON "Package"("retreatId", "name");

-- Step 4: Add packageId index to RoomType
CREATE INDEX "RoomType_packageId_idx" ON "RoomType"("packageId");

-- Step 5: Add packageId to Booking if it doesn't exist
ALTER TABLE "Booking"
ADD COLUMN IF NOT EXISTS "packageId" TEXT;

-- Step 6: Add packageId index to Booking
CREATE INDEX "Booking_packageId_idx" ON "Booking"("packageId");

-- Step 7: Add foreign keys
ALTER TABLE "Package"
ADD CONSTRAINT "Package_retreatId_fkey" FOREIGN KEY ("retreatId") REFERENCES "Retreat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RoomType"
ADD CONSTRAINT "RoomType_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 8: Migrate existing RoomTypes to populate durationDays if not set
UPDATE "RoomType" SET "durationDays" = 6 WHERE "durationDays" IS NULL OR "durationDays" = 0;
