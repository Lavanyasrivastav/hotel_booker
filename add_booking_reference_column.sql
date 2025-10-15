-- Add booking_reference column to existing bookings table
-- Run this in phpMyAdmin or MySQL command line if the column doesn't exist

USE hotelbooker;

-- Check if column exists, if not add it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'hotelbooker' 
     AND TABLE_NAME = 'bookings' 
     AND COLUMN_NAME = 'booking_reference') > 0,
    'SELECT "booking_reference column already exists" as message;',
    'ALTER TABLE bookings ADD COLUMN booking_reference varchar(20) DEFAULT NULL;'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add unique index if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
     WHERE TABLE_SCHEMA = 'hotelbooker' 
     AND TABLE_NAME = 'bookings' 
     AND INDEX_NAME = 'booking_reference') > 0,
    'SELECT "booking_reference index already exists" as message;',
    'ALTER TABLE bookings ADD UNIQUE KEY booking_reference (booking_reference);'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Show current table structure
DESCRIBE bookings;
