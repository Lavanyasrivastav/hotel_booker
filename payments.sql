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
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `payment_reference` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `method` varchar(50) DEFAULT NULL,
  `status` enum('created','paid','failed') DEFAULT 'created',
  `gateway_response` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `payment_reference`, `user_id`, `amount`, `currency`, `method`, `status`, `gateway_response`, `created_at`) VALUES
(1, 'PAYCB9F21D1912B', 0, 28000.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-12 08:39:37'),
(2, 'PAY11A4E931D888', 0, 14400.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-12 09:49:53'),
(3, 'PAYEF2B3890F2BE', 4, 8500.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 08:12:35'),
(4, 'PAYF5743B6D8D5B', 4, 3200.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 08:39:33'),
(5, 'PAYBBC10A0C65E0', 4, 3200.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 08:40:21'),
(6, 'PAY6D137037D615', 4, 12400.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 08:45:32'),
(7, 'PAY84D23661D466', 4, 11800.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 08:46:14'),
(8, 'PAY1B5626808E8A', 4, 11800.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 08:48:19'),
(9, 'PAY18C132284E04', 4, 11800.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 09:04:38'),
(10, 'PAY29A26F1B7B54', 6, 17000.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 14:07:31'),
(11, 'PAYE4CA0827234B', 6, 12400.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 14:59:04'),
(12, 'PAY8D802C1D3910', 4, 14000.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 15:00:55'),
(13, 'PAYE4F8E94D2699', 4, 14000.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 15:05:54'),
(14, 'PAYA225690A33E6', 4, 17000.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 15:13:09'),
(15, 'PAY88BCE1CEF1F1', 4, 42500.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 15:13:26'),
(16, 'PAY833FF2316E7F', 4, 58500.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 15:14:41'),
(17, 'PAYE835F19C769C', 4, 77000.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 20:20:43'),
(18, 'PAY0B6A1A098F67', 4, 5500.00, 'INR', 'credit_card', 'paid', '{\"simulated\":true,\"message\":\"Payment auto-approved (test mode)\"}', '2025-10-15 20:21:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_reference` (`payment_reference`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
