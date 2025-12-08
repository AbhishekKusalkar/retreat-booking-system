-- Migration script to convert from per-night to fixed package pricing
-- This safely renames pricePerNight to packagePrice and removes durationDays

BEGIN;

-- Step 1: Rename pricePerNight to packagePrice
ALTER TABLE "RoomType" RENAME COLUMN "pricePerNight" TO "packagePrice";

-- Step 2: Remove durationDays column (no longer needed for fixed pricing)
ALTER TABLE "RoomType" DROP COLUMN "durationDays";

-- Step 3: Update Package table as well (remove durationDays)
ALTER TABLE "Package" DROP COLUMN "durationDays";

COMMIT;
