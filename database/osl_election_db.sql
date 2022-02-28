-- MySQL dump 10.13  Distrib 5.7.33, for Linux (x86_64)
--
-- Host: localhost    Database: osl_election_db
-- ------------------------------------------------------
-- Server version	5.7.33-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ballots`
--

DROP TABLE IF EXISTS `ballots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ballots` (
  `ballot_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `election_id` int(11) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ballot_id`),
  KEY `fk_ballot_election` (`election_id`),
  CONSTRAINT `fk_ballot_election` FOREIGN KEY (`election_id`) REFERENCES `elections` (`election_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ballots`
--

LOCK TABLES `ballots` WRITE;
/*!40000 ALTER TABLE `ballots` DISABLE KEYS */;
INSERT INTO `ballots` VALUES (6,'President',2,'Presidential Position for HomeComing Court Election','2021-02-16 18:50:14'),(7,'Vice President',2,'Vice President position for HomeComing Elections','2021-02-16 18:50:41');
/*!40000 ALTER TABLE `ballots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidates` (
  `candidate_id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(200) NOT NULL,
  `photo` varchar(300) NOT NULL,
  `ballot_id` int(11) NOT NULL,
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`candidate_id`),
  KEY `fk_candidate_ballot` (`ballot_id`),
  CONSTRAINT `fk_candidate_ballot` FOREIGN KEY (`ballot_id`) REFERENCES `ballots` (`ballot_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (10,'Elizabeth Fatorma','Elizabeth.jpeg',6,'2021-02-16 18:51:48'),(11,'Martha Sumaila','Martha.jpg',6,'2021-02-16 18:52:27'),(13,'Bettie Mason','Bettie 2.jpeg',7,'2021-02-16 18:56:04'),(14,'Danetta Younge','Danetta Pic.jpg',7,'2021-02-16 18:56:35');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(50) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (6,'CEO\'S OFFICE',NULL,'2021-02-15 13:36:24'),(7,'CEO\'S OFFICE - DX',NULL,'2021-02-15 13:36:24'),(8,'CEO\'S OFFICE - FOUNDATION',NULL,'2021-02-15 13:36:24'),(9,'STRATEGIC PLANNING',NULL,'2021-02-15 13:36:24'),(10,'GENERAL SECRETARY',NULL,'2021-02-15 13:36:24'),(11,'IT & N',NULL,'2021-02-15 13:36:24'),(12,'HUMAN RESOURCES',NULL,'2021-02-15 13:36:25'),(13,'FINANCE',NULL,'2021-02-15 13:36:25'),(14,'FINANCE - SCM',NULL,'2021-02-15 13:36:25'),(15,'AUDIT, RISK & INTERNAL CONTROL',NULL,'2021-02-15 13:36:25'),(16,'COMMERCIAL - S&D',NULL,'2021-02-15 13:36:25'),(17,'COMMERCIAL - ENTERPRISE',NULL,'2021-02-15 13:36:25'),(18,'COMMERCIAL - CX',NULL,'2021-02-15 13:36:25'),(19,'ORANGE MOBILE FINANCE (SL) LTD',NULL,'2021-02-15 13:36:25'),(20,'MARKETING & COMMUNICATIONS',NULL,'2021-02-15 22:24:38'),(21,'COMMERCIAL - KYC',NULL,'2021-02-15 22:24:38'),(22,'COMMERCIAL - ORANGE MONEY',NULL,'2021-02-15 22:24:38'),(23,'ORANGE MONEY',NULL,'2021-02-15 22:24:38'),(24,'MARKETING',NULL,'2021-02-15 22:24:38');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `election_status`
--

DROP TABLE IF EXISTS `election_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `election_status` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `election_status`
--

LOCK TABLES `election_status` WRITE;
/*!40000 ALTER TABLE `election_status` DISABLE KEYS */;
INSERT INTO `election_status` VALUES (1,'Beginning',NULL,'2021-02-12 09:43:34');
/*!40000 ALTER TABLE `election_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elections`
--

DROP TABLE IF EXISTS `elections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `elections` (
  `election_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `start_date` varchar(20) NOT NULL,
  `end_date` varchar(20) NOT NULL,
  `status_id` int(11) NOT NULL,
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`election_id`),
  KEY `fk_election_status` (`status_id`),
  CONSTRAINT `fk_election_status` FOREIGN KEY (`status_id`) REFERENCES `election_status` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elections`
--

LOCK TABLES `elections` WRITE;
/*!40000 ALTER TABLE `elections` DISABLE KEYS */;
INSERT INTO `elections` VALUES (2,'Home Coming Court','2021-02-15','2021-02-17',1,'2021-02-14 21:28:30');
/*!40000 ALTER TABLE `elections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_name` varchar(20) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (4,'FREETOWN',NULL,'2021-02-15 13:43:44'),(5,'KENEMA',NULL,'2021-02-15 13:43:44'),(6,'WELLINGTON',NULL,'2021-02-15 13:43:44'),(7,'MAKENI',NULL,'2021-02-15 19:14:08'),(8,'KONO',NULL,'2021-02-15 19:44:09'),(9,'BO',NULL,'2021-02-15 19:44:09');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('ere19FnIVAPrrU2fwNx_xCI7AaTOI8j6',1613596314,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":112}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voters`
--

DROP TABLE IF EXISTS `voters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voters` (
  `voters_id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(150) NOT NULL,
  `sex` char(1) NOT NULL,
  `voter_key` varchar(50) DEFAULT NULL,
  `voter_pass` varchar(50) DEFAULT NULL,
  `department_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `voter_type` varchar(20) DEFAULT NULL,
  `vote_count` int(1) DEFAULT '1',
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`voters_id`),
  KEY `fk_voter_department` (`department_id`),
  KEY `fk_voter_location` (`location_id`),
  CONSTRAINT `fk_voter_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_voter_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voters`
--

LOCK TABLES `voters` WRITE;
/*!40000 ALTER TABLE `voters` DISABLE KEYS */;
INSERT INTO `voters` VALUES (112,'Salim M Jalloh','M','vt01','pass000',11,4,'admin',1,'2021-11-02 18:26:42'),(113,'Abdul Kallon','M','vt02','pass001',11,4,'voter',1,'2021-11-02 18:26:42'),(114,'Marina OConnor','F','vt03','pass002',11,4,'voter',1,'2021-11-02 18:26:42'),(115,'Moses Fornah','M','vt04','pass003',11,4,'voter',1,'2021-11-02 18:26:42'),(116,'Alan Nyuma','M','vt05','pass004',11,4,'voter',1,'2021-11-02 18:26:42'),(117,'Mohamed Lamin Conteh','M','vt06','pass005',11,4,'voter',1,'2021-11-02 18:26:42');
/*!40000 ALTER TABLE `voters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `vote_id` int(11) NOT NULL AUTO_INCREMENT,
  `voters_id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`vote_id`),
  KEY `fk_votes_voter` (`voters_id`),
  KEY `fk_votes_candidate` (`candidate_id`),
  CONSTRAINT `fk_votes_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`candidate_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_votes_voter` FOREIGN KEY (`voters_id`) REFERENCES `voters` (`voters_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (5,112,10,'2021-11-02 20:57:04');
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-16 21:14:46
