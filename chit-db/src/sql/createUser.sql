-- Creates a new user
-- Args1 - $name $phone $address
-- Args2 - $phone
INSERT INTO `users` (`name`, `phone`, `address`) VALUES ($name, $phone, $address);
SELECT * FROM `users` WHERE `phone`= $phone;