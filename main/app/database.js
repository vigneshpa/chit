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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0NBQWtDO0FBQ2xDLHVDQUErQjtBQUMvQiwrQkFBNEI7QUFDNUIsMkJBQWdDO0FBQ2hDLE1BQU0sTUFBTSxHQUFXLFdBQUksQ0FBQyxjQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ2xFLElBQUksWUFBNkIsQ0FBQztBQUVsQyxNQUFNLEtBQUssR0FBNEMsVUFBVSxRQUFRO0lBQ3ZFLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDM0MsTUFBTSxjQUFjLEdBQWMsR0FBRyxFQUFFO1FBQ3JDLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDMUUsUUFBUSxFQUFFLENBQUM7SUFDYixDQUFDLENBQUM7SUFDRixNQUFNLFFBQVEsR0FBYztRQUMxQixJQUFJLEVBQUUsR0FBb0IsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEdBQUc7WUFDakUsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLE9BQU87YUFDUjtZQUNELEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDO2dCQUM5QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM1QixZQUFZLElBQUksVUFBVSxHQUFHLENBQUMsR0FBRyxvQkFBb0IsQ0FBQztvQkFDdEQsWUFBWSxJQUFJLFVBQVUsR0FBRyxDQUFDLEdBQUcsa0JBQWtCLENBQUM7aUJBQ3JEO2dCQUNELEVBQUUsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7cUJBQzlCLEdBQUcsQ0FDRiwrSEFBK0gsQ0FDaEk7cUJBQ0EsR0FBRyxDQUNGLDZMQUE2TCxDQUM5TDtxQkFDQSxHQUFHLENBQ0YseUlBQXlJO29CQUN2SSxZQUFZO29CQUNaLHVHQUF1RyxFQUN6RyxVQUFVLEdBQUc7b0JBQ1gsSUFBSSxHQUFHLEVBQUU7d0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFFbEI7Z0JBQ0gsQ0FBQyxDQUNGLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1gsY0FBYyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDLGVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN2QixRQUFRLEVBQUUsQ0FBQztLQUNaO1NBQU07UUFDTCxjQUFjLEVBQUUsQ0FBQztLQUNsQjtBQUNILENBQUMsQ0FBQztBQUNPLHNCQUFLO0FBRWQsU0FBUyxVQUFVLENBQ2pCLFFBQWdCLEVBQ2hCLEtBQWEsRUFDYixPQUFlLEVBQ2YsUUFBb0Q7SUFFcEQsWUFBWSxDQUFDLFNBQVMsQ0FBQztRQUNyQixJQUFJLGlCQUFpQixHQUFZLEtBQUssQ0FBQztRQUN2QyxZQUFZO2FBQ1QsR0FBRyxDQUNGOztVQUVFLEVBQ0YsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxFQUMxQixVQUFVLEdBQWdCO1lBQ3hCLElBQUksR0FBRyxFQUFFO2dCQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxFQUFFLEVBQUU7b0JBQ3BCLGlCQUFpQixHQUFHLElBQUksQ0FBQztpQkFDMUI7YUFDRjtRQUNILENBQUMsQ0FDRjthQUNBLEdBQUcsQ0FBQyx5Q0FBeUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQ3ZELEdBQWdCLEVBQ2hCLEdBQXFCO1lBRXJCLElBQUksR0FBRztnQkFBRSxNQUFNLEdBQUcsQ0FBQztZQUNuQixJQUFJLGlCQUFpQixFQUFFO2dCQUNyQixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNqRDtpQkFBTTtnQkFDTCxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3JCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFtSFEsZ0NBQVU7QUFsSG5CLFNBQVMsV0FBVyxDQUNsQixJQUFZLEVBQ1osS0FBYSxFQUNiLEtBQWEsRUFDYixPQUE4QyxFQUM5QyxRQUFxRDtJQUVyRCxJQUFJLGtCQUFrQixHQUFZLEtBQUssQ0FBQztJQUN4QyxJQUFJLE1BQXlCLENBQUM7SUFDOUIsSUFBSSxLQUFLLEdBQVcsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztJQUNyRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUM1QixLQUFLLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQztLQUM1QjtJQUNELElBQUksS0FBSyxHQUFHLEVBQUUsRUFBRTtRQUNkLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BFLE9BQU87S0FDUjtJQUNELElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtRQUNoQixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2RSxPQUFPO0tBQ1I7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDckMsWUFBWSxDQUFDLFNBQVMsQ0FBQztRQUNyQixZQUFZLENBQUMsR0FBRyxDQUNkO21DQUM2QixFQUM3QixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUMzQixVQUFVLEdBQWdCO1lBQ3hCLElBQUksR0FBRyxFQUFFO2dCQUNQLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxFQUFFLEVBQUU7b0JBQ3BCLGtCQUFrQixHQUFHLElBQUksQ0FBQztvQkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDbEI7cUJBQU07b0JBQ0wsTUFBTSxHQUFHLENBQUM7aUJBQ1g7YUFDRjtZQUVELFlBQVksQ0FBQyxHQUFHLENBQ2QseUNBQXlDLEdBQUcsS0FBSyxHQUFHLElBQUksRUFDeEQsVUFBVSxJQUFpQixFQUFFLEdBQXNCO2dCQUNqRCxJQUFJLElBQUk7b0JBQUUsTUFBTSxHQUFHLENBQUM7Z0JBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUM7Z0JBQ2IsSUFBSSxrQkFBa0IsRUFBRTtvQkFDdEIsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2pELE9BQU87aUJBQ1I7Z0JBQ0QsSUFBSSxTQUFTLEdBQVksS0FBSyxDQUFDO2dCQUMvQixJQUFJLE1BQWEsQ0FBQztnQkFDbEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7b0JBQzVCLElBQUksU0FBUzt3QkFBRSxNQUFNO29CQUNyQixZQUFZLENBQUMsR0FBRyxDQUNkLHlGQUF5RixFQUN6RixDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUNsRCxVQUFVLElBQWlCO3dCQUN6QixJQUFJLElBQUksRUFBRTs0QkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNsQixTQUFTLEdBQUcsSUFBSSxDQUFDOzRCQUNqQixNQUFNLEdBQUcsR0FBRyxDQUFDO3lCQUNkO29CQUNILENBQUMsQ0FDRixDQUFDO2lCQUNIO2dCQUNELElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2QsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7aUJBQzFCO2dCQUNELFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3pCLElBQUksTUFBTTtvQkFBRSxNQUFNLE1BQU0sQ0FBQztZQUMzQixDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBd0NvQixrQ0FBVztBQXZDaEMsU0FBUyxTQUFTLENBQ2hCLFFBQWtFO0lBRWxFLFlBQVksQ0FBQyxTQUFTLENBQUM7UUFDckIsWUFBWSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxVQUN4QyxHQUFHLEVBQ0gsSUFBNkI7WUFFN0IsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTRCaUMsOEJBQVM7QUEzQjNDLFNBQVMsV0FBVyxDQUNsQixRQUFrRTtJQUVsRSxZQUFZLENBQUMsU0FBUyxDQUFDO1FBQ3JCLFlBQVksQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsVUFDeEMsR0FBRyxFQUNILElBQTZCO1lBRTdCLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FDakIsUUFBOEQ7SUFFOUQsWUFBWSxDQUFDLFNBQVMsQ0FBQztRQUNyQixZQUFZLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLFVBQ3pDLEdBQUcsRUFDSCxJQUF5QjtZQUV6QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFLEtBQUs7Z0JBQy9CLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBbUIsR0FBRyxDQUFDLE9BQVEsQ0FBQyxDQUFDO1lBQzNELENBQUMsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUM0QyxnQ0FBVSJ9