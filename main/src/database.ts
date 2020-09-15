import * as sqlite from "sqlite3";
import { app } from "electron";
import { join } from "path";
import { existsSync } from "fs";
const dbfile: string = join(app.getPath("userData"), "./main.db");
let dbConnection: sqlite.Database;

const start: (callBack: (err?: Error) => any) => any = function (callBack) {
  console.log("Storing data at:\n" + dbfile);
  const openConnection: () => any = () => {
    dbConnection = new sqlite.Database(dbfile).run("PRAGMA foreign_keys=ON;");
    callBack();
  };
  const createDB: () => any = function () {
    let db: sqlite.Database = new sqlite.Database(dbfile, function (err) {
      if (err) {
        callBack(err);
        return;
      }
      db.serialize(function () {
        let monthColumns: string = "";
        for (let i = 1; i <= 20; i++) {
          monthColumns += ", `month" + i + "_toBePaid` INTEGER";
          monthColumns += ", `month" + i + "_isPaid` INTEGER";
        }
        db.run("PRAGMA foreign_keys=ON;")
          .run(
            "CREATE TABLE `users` (`UID` INTEGER NOT NULL PRIMARY KEY, `name` TEXT NOT NULL, `phone` TEXT NOT NULL UNIQUE, `address` TEXT)"
          )
          .run(
            "CREATE TABLE `groups` (`GID` INTEGER NOT NULL PRIMARY KEY, `name` TEXT NOT NULL UNIQUE, `month`  INTEGER NOT NULL, `year` INTEGER NOT NULL, `batch` TEXT NOT NULL, `winners` JSON NOT NULL)"
          )
          .run(
            "CREATE TABLE `cheats` (`CID` INTEGER NOT NULL PRIMARY KEY, `GID` INTEGER NOT NULL, `UID` INTEGER NOT NULL, `no_of_cheats` REAL NOT NULL" +
              monthColumns +
              ", FOREIGN KEY (`GID`) REFERENCES `groups` ( `GID` ), FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) )",
            function (err) {
              if (err) {
                console.log(err);
                //callBack(err);
              }
            }
          );
      });
    });
    db.close();
    openConnection();
  };
  if (!existsSync(dbfile)) {
    createDB();
  } else {
    openConnection();
  }
};
export { start };

function createUser(
  userName: string,
  Phone: string,
  Address: string,
  callBack: (err: Error, row: createUserFields) => any
) {
  dbConnection.serialize(function () {
    let userAlreadyExists: boolean = false;
    dbConnection
      .run(
        "INSERT INTO `USERS` (`name`, `phone`, `address`)\
         VALUES (?, ?, ?);\
         ",
        [userName, Phone, Address],
        function (err: sqliteError) {
          if (err) {
            console.log(err);
            if (err.errno === 19) {
              userAlreadyExists = true;
            }
          }
        }
      )
      .get("SELECT * FROM `users` WHERE `phone`= ?;", [Phone], function (
        err: sqliteError,
        row: createUserFields
      ) {
        if (err) throw err;
        if (userAlreadyExists) {
          callBack(new Error("User already Exists"), row);
        } else {
          callBack(null, row);
        }
      });
  });
}
function createGroup(
  year: number,
  month: number,
  batch: string,
  members: { UID: number; noOfCheats: number }[],
  callback: (err: Error, row: createGroupFields) => any
) {
  let groupAlreadyExists: boolean = false;
  let result: createGroupFields;
  let gName: string = year + "-" + month + "-" + batch;
  let total = 0;
  for (const member of members) {
    total += member.noOfCheats;
  }
  if (total < 20) {
    callback(new Error("Total number of cheats is less than 20"), null);
    return;
  }
  if (total !== 20) {
    callback(new Error("Total number of cheats is not equal to 20"), null);
    return;
  }
  console.log("Serarializing queries");
  dbConnection.serialize(function () {
    dbConnection.run(
      "INSERT INTO `groups` (`name`, `year`, `month`, `batch`, `winners`)\
        VALUES (?, ?, ?, ?, '[]');",
      [gName, year, month, batch],
      function (err: sqliteError) {
        if (err) {
          if (err.errno === 19) {
            groupAlreadyExists = true;
            console.log(err);
          } else {
            throw err;
          }
        }

        dbConnection.get(
          "SELECT * FROM `groups` WHERE `name` = '" + gName + "';",
          function (err1: sqliteError, row: createGroupFields) {
            if (err1) throw err;
            console.log(row);
            result = row;
            if (groupAlreadyExists) {
              callback(new Error("Group already exists"), row);
              return;
            }
            let breakLoop: boolean = false;
            let errMem: Error;
            for (const member of members) {
              if (breakLoop) break;
              dbConnection.run(
                "INSERT INTO `cheats` (`UID`, `GID`, `no_of_cheats`, `month1_toBePaid`) VALUES (?, ?, ?)",
                [member.UID, result.GID, 5000 * member.noOfCheats],
                function (err2: sqliteError) {
                  if (err2) {
                    console.log(err2);
                    breakLoop = true;
                    errMem = err;
                  }
                }
              );
            }
            if (!breakLoop) {
              result.members = members;
            }
            callback(errMem, result);
            if (errMem) throw errMem;
          }
        );
      }
    );
  });
}
function listUsers(
  callBack: (err: sqliteError, rows: Array<createUserFields>) => any
) {
  dbConnection.serialize(function () {
    dbConnection.all("SELECT * FROM `users`", function (
      err,
      rows: Array<createUserFields>
    ) {
      callBack(err, rows);
    });
  });
}
function getUserInfo(
  callBack: (err: sqliteError, rows: Array<createUserFields>) => any
) {
  dbConnection.serialize(function () {
    dbConnection.all("SELECT * FROM `users`", function (
      err,
      rows: Array<createUserFields>
    ) {
      callBack(err, rows);
    });
  });
}
function listGroups(
  callback: (err: sqliteError, rows: createGroupFields[]) => any
) {
  dbConnection.serialize(function () {
    dbConnection.all("SELECT * FROM `groups`", function (
      err,
      rows: createGroupFields[]
    ) {
      rows.forEach(function (row, index) {
        row.winners = JSON.parse(<string>(<unknown>row.winners));
      });
      callback(err, rows);
    });
  });
}
export { createUser, createGroup, listUsers, listGroups };
