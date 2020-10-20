-- Creates a new user
-- Args - $name $phone $address
INSERT INTO `users` (`name`, `phone`, `address`) VALUES ($name, $phone, $address);
SELECT * FROM `users` WHERE `phone`= $phone;