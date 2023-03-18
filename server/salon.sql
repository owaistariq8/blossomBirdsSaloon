CREATE DATABASE blossom;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` TEXT NOT NULL,
  `image` TEXT,
  `accessToken` varchar(100),
  `date_added` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_updated` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `price` int,
  `img1` TEXT DEFAULT NULL,
  `img2` TEXT DEFAULT NULL,
  `img3` TEXT DEFAULT NULL,
  `img4` TEXT DEFAULT NULL,
  `date_added` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_updated` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int,
  `serviceId` int,
  `type` varchar(100),
  `date_added` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_updated` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `price` int,
  `description` TEXT DEFAULT NULL,
  `img1` TEXT DEFAULT NULL,
  `img2` TEXT DEFAULT NULL,
  `img3` TEXT DEFAULT NULL,
  `img4` TEXT DEFAULT NULL,
  `date_added` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_updated` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `date_added` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_updated` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `purchases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `pId` int,
  `status` int,
  `sId` int,
  `date_added` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_updated` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
