-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: db_novamaths
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `student_survey`
--

DROP TABLE IF EXISTS `student_survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_survey` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `response` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_survey`
--

LOCK TABLES `student_survey` WRITE;
/*!40000 ALTER TABLE `student_survey` DISABLE KEYS */;
INSERT INTO `student_survey` VALUES (1,'laila1709','confidence_level','2','2025-06-24 15:07:28'),(2,'laila1709','is_afraid','Yes','2025-06-24 15:18:13'),(3,'laila1709','fear_reason','I don’t get enough support','2025-06-24 15:22:15');
/*!40000 ALTER TABLE `student_survey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_audit_trail`
--

DROP TABLE IF EXISTS `tbl_audit_trail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_audit_trail` (
  `s_no` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL,
  `activity_endpoint` varchar(255) NOT NULL,
  `ip` varchar(45) NOT NULL,
  `use_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`s_no`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_audit_trail`
--

LOCK TABLES `tbl_audit_trail` WRITE;
/*!40000 ALTER TABLE `tbl_audit_trail` DISABLE KEYS */;
INSERT INTO `tbl_audit_trail` VALUES (1,'manu1802','/signup','127.0.0.1','2025-06-23 23:10:44'),(2,'manu1802','/login','127.0.0.1','2025-06-23 23:12:27'),(3,'manu1802','/login','127.0.0.1','2025-06-23 23:13:01'),(4,'manu1802','/login','127.0.0.1','2025-06-24 10:27:21'),(5,'manu1802','/login','127.0.0.1','2025-06-24 10:40:51'),(6,'manu1802','/login','127.0.0.1','2025-06-24 10:50:30'),(7,'manu1802','/login','127.0.0.1','2025-06-24 11:40:08'),(8,'manu1802','/login','127.0.0.1','2025-06-24 11:42:21'),(9,'manu1802','/login','127.0.0.1','2025-06-24 11:44:47'),(10,'manu1802','/login','127.0.0.1','2025-06-24 11:45:13'),(11,'manu1802','/login','127.0.0.1','2025-06-24 12:18:55'),(12,'manu1802','/login','127.0.0.1','2025-06-24 13:00:13'),(13,'manu1802','/login','127.0.0.1','2025-06-24 13:04:13'),(14,'manu1802','/login','127.0.0.1','2025-06-24 13:05:23'),(15,'manu1802','/login','127.0.0.1','2025-06-24 13:07:14'),(16,'manu1802','/login','127.0.0.1','2025-06-24 13:22:33'),(17,'manu1802','/login','127.0.0.1','2025-06-24 13:28:59'),(18,'manu1802','/login','127.0.0.1','2025-06-24 13:31:06'),(19,'manu1802','/login','127.0.0.1','2025-06-24 13:35:55'),(20,'manu1802','/login','127.0.0.1','2025-06-24 13:37:54'),(21,'manu1802','/login','127.0.0.1','2025-06-24 13:43:00'),(22,'manu1802','/login','127.0.0.1','2025-06-24 13:44:28'),(23,'manu1802','/login','127.0.0.1','2025-06-24 13:45:54'),(24,'manu1802','/login','127.0.0.1','2025-06-24 13:52:26'),(25,'manu1802','/login','127.0.0.1','2025-06-24 13:55:42'),(26,'manu1802','/login','127.0.0.1','2025-06-24 14:31:17'),(27,'laila1709','/force-reset-password','127.0.0.1','2025-06-24 14:31:55'),(28,'laila1709','/force-reset-password','127.0.0.1','2025-06-24 14:40:27'),(29,'manu1802','/login','127.0.0.1','2025-06-24 14:42:37'),(30,'laila1709','/login','127.0.0.1','2025-06-24 14:43:48'),(31,'laila1709','/login','127.0.0.1','2025-06-24 15:07:20'),(32,'laila1709','/login','127.0.0.1','2025-06-24 15:18:06'),(33,'laila1709','/login','127.0.0.1','2025-06-24 15:22:05');
/*!40000 ALTER TABLE `tbl_audit_trail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_login`
--

DROP TABLE IF EXISTS `tbl_user_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_login` (
  `user_id` varchar(100) NOT NULL,
  `f_name` varchar(50) NOT NULL,
  `l_name` varchar(50) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile_no` varchar(15) NOT NULL,
  `pass_word` varchar(255) NOT NULL,
  `user_type` enum('student','teacher','admin') NOT NULL,
  `school` varchar(100) DEFAULT NULL,
  `class` varchar(20) DEFAULT NULL,
  `board` varchar(50) DEFAULT NULL,
  `med_ins` enum('Hindi','English') NOT NULL,
  `state` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status_reg` enum('reg','unreg','startsusing') DEFAULT 'unreg',
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `tbl_user_login_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `tbl_user_login` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_login`
--

LOCK TABLES `tbl_user_login` WRITE;
/*!40000 ALTER TABLE `tbl_user_login` DISABLE KEYS */;
INSERT INTO `tbl_user_login` VALUES ('aarav1505','Aarav','Sharma','Male','2016-05-15','sid321axn@gmail.com','8584986762','pbkdf2:sha256:600000$cgeqbE1vkC1rins0$12ad4030db268ef6c8b830470b63e6186a33287bce4e1c02345484742e081dc0','student',NULL,'3','ICSE','English','UP','Lucknow','2025-06-24 13:55:52','reg','manu1802'),('anita1802','Anita','devi','Female','2017-02-18','sid321axn@gmail.com','8584986762','pbkdf2:sha256:600000$JMt7j2m1PciKECXq$0722035e64487b7863c0eb821b28d8f969ab2b6e27ddeb848754520520b29416','student',NULL,'2','ICSE','English','UP','Lucknow','2025-06-24 13:55:52','reg','manu1802'),('laila1709','Laila','Singh','Female','2016-09-17','sid321axn@gmail.com','8584986762','pbkdf2:sha256:600000$Rc8erWPNydOdgQGO$8930c2056589d89529065d9d59b648e0d4806821abd6ea85a9d31feb314f1df6','student',NULL,'3','ICSE','English','UP','Lucknow','2025-06-24 13:57:38','reg','manu1802'),('manu1802','Manu','Sid','Male','1989-02-18','sid321axn@gmail.com','8584986762','pbkdf2:sha256:600000$nb20J4IcjE3nB2uP$5690d4d6acb7abfff5552291d1cad2ccb8ee3f35951e08c7019adff7b8f6ff54','admin','JLR','NA','ICSE','English','UP','Lucknow','2025-06-23 23:10:44','unreg',NULL),('manu1802-1','Manu','Siddhartha','Male','2014-02-18','sid321axn@gmail.com','8584986762','pbkdf2:sha256:600000$f7ep8kCGbRBRkSd2$69d1d423970190543565863c890ba9ade4fdb3071c84d42673d26006f8fcc056','student',NULL,'5','ICSE','English','UP','Lucknow','2025-06-24 13:57:37','reg','manu1802'),('pankaj1903','Pankaj','Mishra','Male','2015-03-19','sid321axn@gmail.com','8584986762','pbkdf2:sha256:600000$OLIn9MdRAESAwV6N$6e8d4c3e0bd4bba67eb7d643675b93f2061232ff7c5e7aa8cdfef2980e4f03eb','student',NULL,'4','ICSE','English','UP','Lucknow','2025-06-24 13:55:53','reg','manu1802');
/*!40000 ALTER TABLE `tbl_user_login` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-24 16:05:48
