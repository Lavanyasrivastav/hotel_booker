-- Database Update Script to Add booking_reference Column
-- Run this script to update your existing database

USE hotelbooker;

-- Add the booking_reference column to the bookings table
ALTER TABLE `bookings` 
ADD COLUMN `booking_reference` varchar(20) DEFAULT NULL;

-- Add unique index for booking_reference
ALTER TABLE `bookings`
ADD UNIQUE KEY `booking_reference` (`booking_reference`);

-- Update existing records with booking references
UPDATE `bookings` SET `booking_reference` = 'BK1234567890' WHERE `id` = 1;
UPDATE `bookings` SET `booking_reference` = 'BK2345678901' WHERE `id` = 2;
UPDATE `bookings` SET `booking_reference` = 'BK3456789012' WHERE `id` = 3;
UPDATE `bookings` SET `booking_reference` = 'BK4567890123' WHERE `id` = 4;
UPDATE `bookings` SET `booking_reference` = 'BK5678901234' WHERE `id` = 5;
UPDATE `bookings` SET `booking_reference` = 'BK6789012345' WHERE `id` = 6;
UPDATE `bookings` SET `booking_reference` = 'BK7890123456' WHERE `id` = 7;
UPDATE `bookings` SET `booking_reference` = 'BK8901234567' WHERE `id` = 8;
UPDATE `bookings` SET `booking_reference` = 'BK9012345678' WHERE `id` = 9;
UPDATE `bookings` SET `booking_reference` = 'BK0123456789' WHERE `id` = 10;
UPDATE `bookings` SET `booking_reference` = 'BK1123456789' WHERE `id` = 11;
UPDATE `bookings` SET `booking_reference` = 'BK2123456789' WHERE `id` = 12;
UPDATE `bookings` SET `booking_reference` = 'BK3123456789' WHERE `id` = 13;
UPDATE `bookings` SET `booking_reference` = 'BK4123456789' WHERE `id` = 14;
UPDATE `bookings` SET `booking_reference` = 'BK5123456789' WHERE `id` = 15;
UPDATE `bookings` SET `booking_reference` = 'BK6123456789' WHERE `id` = 16;
UPDATE `bookings` SET `booking_reference` = 'BK7123456789' WHERE `id` = 17;

-- Verify the changes
SELECT id, booking_reference, created_at FROM bookings ORDER BY id;
