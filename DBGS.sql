CREATE DATABASE IF NOT EXISTS `MarkerMarker`;
USE `MarkerMarker`;
CREATE TABLE `demands` (
	`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `building` VARCHAR(32) NOT NULL,
    `room` INT NOT NULL,
    `demand` VARCHAR(32) NOT NULL
);