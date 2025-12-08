-- Update schema from per-night pricing to full package pricing
-- This migration changes RoomType.pricePerNight to packagePrice to reflect full package pricing
-- Add durationDays to track package length

ALTER TABLE "RoomType" 
RENAME COLUMN "pricePerNight" TO "packagePrice";

-- Add optional durationDays field to help calculate per-night rates if needed
ALTER TABLE "RoomType" 
ADD COLUMN IF NOT EXISTS "durationDays" INTEGER DEFAULT 6;

-- Add comment to clarify the pricing model has changed
-- packagePrice is now the full package price (e.g., for 6 days, 10 days)
-- durationDays indicates the package length
