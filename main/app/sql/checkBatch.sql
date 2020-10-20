-- Checks weather a batch exixts
-- Args - $batch $month $year
SELECT `batch` FROM `groups` WHERE `batch`=$batch AND `month`=$month AND `year`=$year