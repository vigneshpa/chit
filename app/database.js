"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listGroups = exports.listUsers = exports.createGroup = exports.createUser = exports.start = void 0;
const sqlite = require("sqlite3");
const electron_1 = require("electron");
const path_1 = require("path");
const fs_1 = require("fs");
const dbfile = path_1.join(electron_1.app.getPath("userData"), "./main.db");
let dbConnection;
const start = function (callBack) {
    console.log("Storing data at:\n" + dbfile);
    const openConnection = () => {
        dbConnection = new sqlite.Database(dbfile).run("PRAGMA foreign_keys=ON;");
        callBack();
    };
    const createDB = function () {
        let db = new sqlite.Database(dbfile, function (err) {
            if (err) {
                callBack(err);
                return;
            }
            db.serialize(function () {
                let monthColumns = "";
                for (let i = 1; i <= 20; i++) {
                    monthColumns += ", `month" + i + "_toBePaid` INTEGER";
                    monthColumns += ", `month" + i + "_isPaid` INTEGER";
                }
                db.run("PRAGMA foreign_keys=ON;")
                    .run("CREATE TABLE `users` (`UID` INTEGER NOT NULL PRIMARY KEY, `name` TEXT NOT NULL, `phone` TEXT NOT NULL UNIQUE, `address` TEXT)")
                    .run("CREATE TABLE `groups` (`GID` INTEGER NOT NULL PRIMARY KEY, `name` TEXT NOT NULL UNIQUE, `month`  INTEGER NOT NULL, `year` INTEGER NOT NULL, `batch` TEXT NOT NULL, `winners` JSON NOT NULL)")
                    .run("CREATE TABLE `cheats` (`CID` INTEGER NOT NULL PRIMARY KEY, `GID` INTEGER NOT NULL, `UID` INTEGER NOT NULL, `no_of_cheats` REAL NOT NULL" +
                    monthColumns +
                    ", FOREIGN KEY (`GID`) REFERENCES `groups` ( `GID` ), FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) )", function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
        db.close();
        openConnection();
    };
    if (!fs_1.existsSync(dbfile)) {
        createDB();
    }
    else {
        openConnection();
    }
};
exports.start = start;
function createUser(userName, Phone, Address, callBack) {
    dbConnection.serialize(function () {
        let userAlreadyExists = false;
        dbConnection
            .run("INSERT INTO `USERS` (`name`, `phone`, `address`)\
         VALUES (?, ?, ?);\
         ", [userName, Phone, Address], function (err) {
            if (err) {
                console.log(err);
                if (err.errno === 19) {
                    userAlreadyExists = true;
                }
            }
        })
            .get("SELECT * FROM `users` WHERE `phone`= ?;", [Phone], function (err, row) {
            if (err)
                throw err;
            if (userAlreadyExists) {
                callBack(new Error("User already Exists"), row);
            }
            else {
                callBack(null, row);
            }
        });
    });
}
exports.createUser = createUser;
function createGroup(year, month, batch, members, callback) {
    let groupAlreadyExists = false;
    let result;
    let gName = year + "-" + month + "-" + batch;
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
        dbConnection.run("INSERT INTO `groups` (`name`, `year`, `month`, `batch`, `winners`)\
        VALUES (?, ?, ?, ?, '[]');", [gName, year, month, batch], function (err) {
            if (err) {
                if (err.errno === 19) {
                    groupAlreadyExists = true;
                    console.log(err);
                }
                else {
                    throw err;
                }
            }
            dbConnection.get("SELECT * FROM `groups` WHERE `name` = '" + gName + "';", function (err1, row) {
                if (err1)
                    throw err;
                console.log(row);
                result = row;
                if (groupAlreadyExists) {
                    callback(new Error("Group already exists"), row);
                    return;
                }
                let breakLoop = false;
                let errMem;
                for (const member of members) {
                    if (breakLoop)
                        break;
                    dbConnection.run("INSERT INTO `cheats` (`UID`, `GID`, `no_of_cheats`, `month1_toBePaid`) VALUES (?, ?, ?)", [member.UID, result.GID, 5000 * member.noOfCheats], function (err2) {
                        if (err2) {
                            console.log(err2);
                            breakLoop = true;
                            errMem = err;
                        }
                    });
                }
                if (!breakLoop) {
                    result.members = members;
                }
                callback(errMem, result);
                if (errMem)
                    throw errMem;
            });
        });
    });
}
exports.createGroup = createGroup;
function listUsers(callBack) {
    dbConnection.serialize(function () {
        dbConnection.all("SELECT * FROM `users`", function (err, rows) {
            callBack(err, rows);
        });
    });
}
exports.listUsers = listUsers;
function getUserInfo(callBack) {
    dbConnection.serialize(function () {
        dbConnection.all("SELECT * FROM `users`", function (err, rows) {
            callBack(err, rows);
        });
    });
}
function listGroups(callback) {
    dbConnection.serialize(function () {
        dbConnection.all("SELECT * FROM `groups`", function (err, rows) {
            rows.forEach(function (row, index) {
                row.winners = JSON.parse(row.winners);
            });
            callback(err, rows);
        });
    });
}
exports.listGroups = listGroups;
