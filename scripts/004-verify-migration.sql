-- Verification Script: Verify Package System Migration
-- Run this after 003-add-package-system.sql to confirm all changes

-- Check if Package table exists
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'Package'
) as package_table_exists;

-- Check RoomType columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'RoomType' 
ORDER BY ordinal_position;

-- Check Package columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Package' 
ORDER BY ordinal_position;

-- Check Booking columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Booking' 
ORDER BY ordinal_position;

-- Count existing constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name IN ('Package', 'RoomType', 'Booking');
