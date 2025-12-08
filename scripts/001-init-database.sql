-- Create Influencer table
CREATE TABLE IF NOT EXISTS "Influencer" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bio TEXT,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create PromoCode table
CREATE TABLE IF NOT EXISTS "PromoCode" (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  "discountPercentage" INTEGER NOT NULL DEFAULT 10,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "influencerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("influencerId") REFERENCES "Influencer"(id) ON DELETE CASCADE
);

-- Create Retreat table
CREATE TABLE IF NOT EXISTS "Retreat" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  "basePrice" DOUBLE PRECISION NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  "maxCapacity" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create RetreatDate table
CREATE TABLE IF NOT EXISTS "RetreatDate" (
  id TEXT PRIMARY KEY,
  "retreatId" TEXT NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  capacity INTEGER NOT NULL,
  booked INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("retreatId") REFERENCES "Retreat"(id) ON DELETE CASCADE
);

-- Create RoomType table
CREATE TABLE IF NOT EXISTS "RoomType" (
  id TEXT PRIMARY KEY,
  "retreatId" TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  "pricePerNight" DOUBLE PRECISION NOT NULL,
  "maxGuests" INTEGER NOT NULL,
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("retreatId") REFERENCES "Retreat"(id) ON DELETE CASCADE
);

-- Create Guest table
CREATE TABLE IF NOT EXISTS "Guest" (
  id TEXT PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Booking table
CREATE TABLE IF NOT EXISTS "Booking" (
  id TEXT PRIMARY KEY,
  "guestId" TEXT NOT NULL,
  "retreatId" TEXT NOT NULL,
  "retreatDateId" TEXT NOT NULL,
  "roomTypeId" TEXT NOT NULL,
  "numberOfGuests" INTEGER NOT NULL,
  "promoCodeId" TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "totalPrice" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("guestId") REFERENCES "Guest"(id) ON DELETE CASCADE,
  FOREIGN KEY ("retreatId") REFERENCES "Retreat"(id) ON DELETE CASCADE,
  FOREIGN KEY ("retreatDateId") REFERENCES "RetreatDate"(id) ON DELETE CASCADE,
  FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"(id) ON DELETE CASCADE,
  FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"(id) ON DELETE SET NULL
);

-- Create Payment table
CREATE TABLE IF NOT EXISTS "Payment" (
  id TEXT PRIMARY KEY,
  "bookingId" TEXT NOT NULL,
  "stripeSessionId" TEXT NOT NULL UNIQUE,
  amount DOUBLE PRECISION NOT NULL,
  "paymentType" TEXT NOT NULL DEFAULT 'DEPOSIT',
  status TEXT NOT NULL DEFAULT 'PENDING',
  "paidAt" TIMESTAMP,
  "stripeReceiptUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "PromoCode_influencerId_idx" ON "PromoCode"("influencerId");
CREATE INDEX IF NOT EXISTS "RetreatDate_retreatId_idx" ON "RetreatDate"("retreatId");
CREATE INDEX IF NOT EXISTS "RoomType_retreatId_idx" ON "RoomType"("retreatId");
CREATE INDEX IF NOT EXISTS "Guest_email_idx" ON "Guest"(email);
CREATE INDEX IF NOT EXISTS "Booking_guestId_idx" ON "Booking"("guestId");
CREATE INDEX IF NOT EXISTS "Booking_retreatId_idx" ON "Booking"("retreatId");
CREATE INDEX IF NOT EXISTS "Booking_retreatDateId_idx" ON "Booking"("retreatDateId");
CREATE INDEX IF NOT EXISTS "Booking_promoCodeId_idx" ON "Booking"("promoCodeId");
CREATE INDEX IF NOT EXISTS "Payment_bookingId_idx" ON "Payment"("bookingId");
CREATE INDEX IF NOT EXISTS "Payment_stripeSessionId_idx" ON "Payment"("stripeSessionId");
