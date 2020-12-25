-- Creates a new Batch
-- Args1 - $name $year $month $batch
-- Args2 - $name
INSERT INTO `groups` (`name`, `batch`, `month`, `year`)
VALUES ($name, $batch, $month, $year);
SELECT * FROM `groups` WHERE `name` = $name