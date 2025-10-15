-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 15, 2025 at 10:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotelbooker`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Lavanya Sharma', 'lavanya@example.com', '$2y$10$NwWvEOBG0w0GxONFUVbC6uG7G2G90Qjq8pE99sd6h7V8r5U2QF9vy', '2025-10-12 06:13:25'),
(2, 'Amit Verma', 'amit@example.com', '$2y$10$NwWvEOBG0w0GxONFUVbC6uG7G2G90Qjq8pE99sd6h7V8r5U2QF9vy', '2025-10-12 06:13:25'),
(3, 'Priya Das', 'priya@example.com', '$2y$10$NwWvEOBG0w0GxONFUVbC6uG7G2G90Qjq8pE99sd6h7V8r5U2QF9vy', '2025-10-12 06:13:25'),
(4, 'Lavanya', 'lavanyasrivastav1610@gmail.com', '$2y$10$gSVgHdVNXdqH3f4Jm5OZ0u4NS7DgrJls21BksfIuigQqvlpYnvwWa', '2025-10-15 08:12:05'),
(5, 'gg', 'bhanvh35@gmail.com', '$2y$10$Kc7vh1Up0erF7KfhOlj4/uOVimjhroKBRNpCT4GVZfSIDmbZdMS76', '2025-10-15 08:22:38'),
(6, 'janhvi', 'abc@gmail.com', '$2y$10$OaOeatPMgrZQYG050B5Um.QYX87EZw5TeWzSxWjLzn3BFdcgNWZMG', '2025-10-15 14:05:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
