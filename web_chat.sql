-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 01, 2016 at 06:10 AM
-- Server version: 5.7.12
-- PHP Version: 7.0.10-1+deb.sury.org~trusty+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_chat`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `user_id` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  `friend_id` varchar(50) NOT NULL,
  `chat` text NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `friend`
--

CREATE TABLE `friend` (
  `user_id` varchar(50) NOT NULL,
  `friend_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `friend`
--

INSERT INTO `friend` (`user_id`, `friend_id`) VALUES
('2aa7f672-e70a-4b71-a608-8bb2ff83e6d3', 'd162f8db-c006-4574-8c93-b25a7df777d9'),
('b94066c3-170b-41af-8ce5-2063f018e917', 'e4b1dce0-03ec-4cfe-a895-d277b52a4f27'),
('b94066c3-170b-41af-8ce5-2063f018e917', 'e5e7795c-72fa-46de-b722-518405076a5f'),
('d162f8db-c006-4574-8c93-b25a7df777d9', '2aa7f672-e70a-4b71-a608-8bb2ff83e6d3'),
('e4b1dce0-03ec-4cfe-a895-d277b52a4f27', 'b94066c3-170b-41af-8ce5-2063f018e917'),
('e5e7795c-72fa-46de-b722-518405076a5f', 'b94066c3-170b-41af-8ce5-2063f018e917');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `admin_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `group_chat`
--

CREATE TABLE `group_chat` (
  `group_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  `chat` text NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `photo_url` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `photo_url`) VALUES
('01fa85ea-d2bc-4852-ab35-7db61c0d37b2', 'gerry', 'terserah', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('2aa7f672-e70a-4b71-a608-8bb2ff83e6d3', 'edwin', 'secret', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('4577946d-7452-44c3-a6a2-150f749a554e', 'tio', 'terserah', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('5b1ec427-7d0e-491e-b136-bfae421378b0', 'jessica', 'terserah', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('856d434b-fa99-4061-8275-15f918bcab76', 'try', 'terserah', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('b94066c3-170b-41af-8ce5-2063f018e917', 'david', 'terserah', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('c02df700-9d1a-4979-83c6-31bca1b9f4db', 'elvan', 'gelut', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('d162f8db-c006-4574-8c93-b25a7df777d9', 'randi', 'secrets', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('e4b1dce0-03ec-4cfe-a895-d277b52a4f27', 'vincent', 'apapun', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('e5e7795c-72fa-46de-b722-518405076a5f', 'erick', 'terserah', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png'),
('f25c4e79-0a1a-45a8-b7ca-338c921cbcba', 'vicko', 'terserah', 'http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`user_id`,`date`);

--
-- Indexes for table `friend`
--
ALTER TABLE `friend`
  ADD PRIMARY KEY (`user_id`,`friend_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`,`user_id`);

--
-- Indexes for table `group_chat`
--
ALTER TABLE `group_chat`
  ADD PRIMARY KEY (`user_id`,`group_id`,`date`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
