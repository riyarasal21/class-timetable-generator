-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: localhost    Database: class_timetable_db
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `class_name` enum('FY','SY','TY') NOT NULL,
  PRIMARY KEY (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'FY'),(2,'SY'),(3,'TY');
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labs`
--

DROP TABLE IF EXISTS `labs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labs` (
  `lab_id` int NOT NULL AUTO_INCREMENT,
  `lab_name` varchar(20) NOT NULL,
  PRIMARY KEY (`lab_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labs`
--

LOCK TABLES `labs` WRITE;
/*!40000 ALTER TABLE `labs` DISABLE KEYS */;
INSERT INTO `labs` VALUES (1,'Lab-1'),(2,'Lab-2');
/*!40000 ALTER TABLE `labs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practical_allocation`
--

DROP TABLE IF EXISTS `practical_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practical_allocation` (
  `practical_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `batch` enum('A','B') DEFAULT NULL,
  `lab_id` int DEFAULT NULL,
  `duration_hours` int DEFAULT '2',
  PRIMARY KEY (`practical_id`),
  KEY `class_id` (`class_id`),
  KEY `subject_id` (`subject_id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `lab_id` (`lab_id`),
  CONSTRAINT `practical_allocation_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`),
  CONSTRAINT `practical_allocation_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  CONSTRAINT `practical_allocation_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`),
  CONSTRAINT `practical_allocation_ibfk_4` FOREIGN KEY (`lab_id`) REFERENCES `labs` (`lab_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practical_allocation`
--

LOCK TABLES `practical_allocation` WRITE;
/*!40000 ALTER TABLE `practical_allocation` DISABLE KEYS */;
INSERT INTO `practical_allocation` VALUES (1,1,1,1,'A',1,2),(2,1,1,1,'B',2,2),(3,1,2,2,'A',1,2),(4,1,2,2,'B',2,2),(5,1,3,3,'A',1,2),(6,1,3,3,'B',2,2),(7,2,8,3,'A',1,2),(8,2,8,3,'B',2,2),(9,2,9,4,'A',1,2),(10,2,9,4,'B',2,2),(11,2,10,1,'A',1,2),(12,2,10,1,'B',2,2),(13,2,12,5,'A',1,2),(14,2,12,5,'B',2,2),(21,3,17,2,'A',1,2),(22,3,17,2,'B',2,2),(23,3,18,4,'A',1,2),(24,3,18,4,'B',2,2),(25,3,19,8,'A',1,2),(26,3,19,8,'B',2,2);
/*!40000 ALTER TABLE `practical_allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_name` varchar(20) NOT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'309'),(2,'311'),(3,'OAL');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `roll_no` varchar(20) DEFAULT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `roll_no` (`roll_no`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (26,'101','FY Student 1','101',1),(27,'102','FY Student 2','102',1),(28,'103','FY Student 3','103',1),(29,'104','FY Student 4','104',1),(30,'105','FY Student 5','105',1),(31,'106','FY Student 6','106',1),(32,'107','FY Student 7','107',1),(33,'108','FY Student 8','108',1),(34,'201','SY Student 1','201',2),(35,'202','SY Student 2','202',2),(36,'203','SY Student 3','203',2),(37,'204','SY Student 4','204',2),(38,'205','SY Student 5','205',2),(39,'206','SY Student 6','206',2),(40,'207','SY Student 7','207',2),(41,'208','SY Student 8','208',2),(42,'301','TY Student 1','301',3),(43,'302','TY Student 2','302',3),(44,'303','TY Student 3','303',3),(45,'304','TY Student 4','304',3),(46,'305','TY Student 5','305',3),(47,'306','TY Student 6','306',3),(48,'307','TY Student 7','307',3),(49,'308','TY Student 8','308',3);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `subject_id` int NOT NULL AUTO_INCREMENT,
  `subject_name` varchar(50) NOT NULL,
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'PP'),(2,'FOC'),(3,'DBMS'),(4,'DM'),(5,'GT'),(6,'SS'),(7,'ECDM'),(8,'JAVA'),(9,'TOC'),(10,'OS'),(11,'NM'),(12,'PL/SQL'),(15,'AL/ML'),(16,'MERN'),(17,'IR'),(18,'STATISTICS'),(19,'EH');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `teacher_name` varchar(50) NOT NULL,
  PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,'VA'),(2,'BN'),(3,'PP'),(4,'RS'),(5,'PH'),(8,'BP');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theory_allocation`
--

DROP TABLE IF EXISTS `theory_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theory_allocation` (
  `theory_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `min_lectures` int NOT NULL,
  PRIMARY KEY (`theory_id`),
  KEY `class_id` (`class_id`),
  KEY `subject_id` (`subject_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `theory_allocation_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`),
  CONSTRAINT `theory_allocation_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  CONSTRAINT `theory_allocation_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theory_allocation`
--

LOCK TABLES `theory_allocation` WRITE;
/*!40000 ALTER TABLE `theory_allocation` DISABLE KEYS */;
INSERT INTO `theory_allocation` VALUES (1,1,1,1,3),(2,1,2,2,3),(3,1,3,3,3),(4,1,4,4,2),(5,1,5,5,3),(6,1,6,4,2),(7,1,7,2,2),(8,2,8,3,3),(9,2,9,4,3),(10,2,10,1,3),(11,2,11,4,3),(12,2,12,5,3),(15,3,15,5,3),(16,3,16,5,3),(17,3,17,2,3),(18,3,18,4,3),(19,3,19,8,3);
/*!40000 ALTER TABLE `theory_allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_slots`
--

DROP TABLE IF EXISTS `time_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_slots` (
  `time_slot_id` int NOT NULL AUTO_INCREMENT,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `slot_order` int DEFAULT NULL,
  PRIMARY KEY (`time_slot_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_slots`
--

LOCK TABLES `time_slots` WRITE;
/*!40000 ALTER TABLE `time_slots` DISABLE KEYS */;
INSERT INTO `time_slots` VALUES (1,'07:15:00','08:15:00',1),(2,'08:15:00','09:15:00',2),(3,'09:15:00','09:40:00',3),(5,'11:40:00','12:40:00',6),(6,'09:40:00','10:40:00',4),(7,'10:40:00','11:40:00',5);
/*!40000 ALTER TABLE `time_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable` (
  `timetable_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int DEFAULT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') DEFAULT NULL,
  `time_slot_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `lab_id` int DEFAULT NULL,
  `batch` enum('A','B') DEFAULT NULL,
  `entry_type` enum('LECTURE','PRACTICAL','BREAK') DEFAULT NULL,
  `practical_group` int DEFAULT NULL,
  `duration` int DEFAULT '1',
  PRIMARY KEY (`timetable_id`),
  UNIQUE KEY `unique_lecture` (`class_id`,`day`,`time_slot_id`,`subject_id`,`teacher_id`,`room_id`,`entry_type`),
  UNIQUE KEY `unique_class_slot_batch` (`class_id`,`day`,`time_slot_id`,`batch`,`entry_type`),
  UNIQUE KEY `unique_teacher_time` (`teacher_id`,`day`,`time_slot_id`),
  UNIQUE KEY `unique_room_time` (`room_id`,`day`,`time_slot_id`),
  UNIQUE KEY `unique_lab_time` (`lab_id`,`day`,`time_slot_id`),
  KEY `time_slot_id` (`time_slot_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `timetable_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`),
  CONSTRAINT `timetable_ibfk_2` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slots` (`time_slot_id`),
  CONSTRAINT `timetable_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  CONSTRAINT `timetable_ibfk_4` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`),
  CONSTRAINT `timetable_ibfk_5` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`),
  CONSTRAINT `timetable_ibfk_6` FOREIGN KEY (`lab_id`) REFERENCES `labs` (`lab_id`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable`
--

LOCK TABLES `timetable` WRITE;
/*!40000 ALTER TABLE `timetable` DISABLE KEYS */;
INSERT INTO `timetable` VALUES (67,2,'Monday',6,10,1,2,NULL,NULL,'LECTURE',NULL,1),(72,1,'Tuesday',3,NULL,NULL,NULL,NULL,NULL,'BREAK',NULL,1),(112,NULL,'Monday',NULL,NULL,NULL,NULL,NULL,NULL,'LECTURE',NULL,1),(113,NULL,'Monday',NULL,NULL,NULL,NULL,NULL,NULL,'LECTURE',NULL,1),(115,1,'Tuesday',1,2,2,1,NULL,NULL,'LECTURE',NULL,1),(137,3,'Monday',1,19,8,NULL,2,'B','PRACTICAL',NULL,1),(138,3,'Monday',1,16,5,NULL,1,'A','PRACTICAL',NULL,1),(139,3,'Tuesday',1,15,5,NULL,1,'A','PRACTICAL',NULL,1),(140,3,'Tuesday',1,18,4,NULL,2,'B','PRACTICAL',NULL,1),(141,3,'Wednesday',1,18,4,3,NULL,NULL,'LECTURE',NULL,1),(142,3,'Wednesday',2,16,5,3,NULL,NULL,'LECTURE',NULL,1),(145,3,'Thursday',6,17,2,NULL,1,'A','PRACTICAL',NULL,1),(146,3,'Thursday',6,18,4,NULL,2,'B','PRACTICAL',NULL,1),(149,2,'Thursday',1,9,4,3,NULL,NULL,'LECTURE',NULL,1),(157,NULL,'Monday',NULL,NULL,NULL,NULL,NULL,NULL,'LECTURE',NULL,1),(163,2,'Monday',3,NULL,NULL,3,NULL,NULL,'BREAK',NULL,1),(167,NULL,'Monday',NULL,NULL,NULL,NULL,NULL,NULL,'LECTURE',NULL,1),(168,1,'Monday',5,4,4,2,NULL,NULL,'LECTURE',NULL,1),(170,NULL,'Monday',NULL,NULL,NULL,NULL,NULL,NULL,'LECTURE',NULL,1),(171,NULL,'Monday',NULL,NULL,NULL,NULL,NULL,NULL,'LECTURE',NULL,1),(172,NULL,'Monday',NULL,NULL,NULL,NULL,NULL,NULL,'LECTURE',NULL,1),(178,NULL,'Monday',NULL,NULL,NULL,NULL,NULL,NULL,'LECTURE',NULL,1),(180,1,'Monday',1,4,4,2,NULL,NULL,'LECTURE',NULL,1),(182,1,'Monday',2,3,3,1,NULL,NULL,'LECTURE',NULL,1);
/*!40000 ALTER TABLE `timetable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-09 12:58:58
