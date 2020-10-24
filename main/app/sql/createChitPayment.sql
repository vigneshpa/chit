-- Adds a payment entry to a Chit
-- Args1 - $CID $nmonth $to_be_paid
-- Args2 - $CID $nmonth
INSERT INTO `payments` ( `CID`, `nmonth`, `to_be_paid`, `is_paid` ) VALUES ( $CID, $nmonth, $to_be_paid, FALSE );
SELECT * FROM `payments` WHERE `CID` = $CID AND `nmonth` = $nmonth;