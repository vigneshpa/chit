--Creates a new chit
--Args1 - $UID $CID $no_of_chits
--Args2 - $UID $CID
INSERT INTO `chits` ( `UID`, `GID`, `no_of_chits` ) VALUES ( $UID, $GID, $no_of_chits );
SELECT * FROM `chits` WHERE `UID` = $UID AND `GID` = $GID;