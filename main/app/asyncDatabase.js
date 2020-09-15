"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.listGroups = exports.listUsers = exports.createGroup = exports.createUser = exports.start = void 0;
const sqlite3_1 = require("./sqlite3");
const path_1 = require("path");
const electron_1 = require("electron");
const fs_1 = require("fs");
const util_1 = require("util");
const existsP = util_1.promisify(fs_1.exists);
const dbFile = path_1.join(electron_1.app.getPath("userData"), "./main.db");
let db = new sqlite3_1.default();
console.log("Stroing data at ", dbFile);
async function start() {
    if (await existsP(dbFile)) {
        await db.open(dbFile);
    }
    else {
        await db.open(dbFile);
        await db.run("PRAGMA foreign_keys=ON;");
        let monthColumns = "";
        for (let i = 1; i <= 20; i++) {
            monthColumns += ", `month" + i + "_toBePaid` INTEGER";
            monthColumns += ", `month" + i + "_isPaid` INTEGER";
        }
        await db.transaction(function (db1) {
            return Promise.all([
                db.run(`CREATE TABLE \`users\` (\`UID\` INTEGER NOT NULL PRIMARY KEY, \`name\` TEXT NOT NULL, \`phone\` TEXT NOT NULL UNIQUE, \`address\` TEXT)`),
                db.run(`CREATE TABLE \`groups\` (\`GID\` INTEGER NOT NULL PRIMARY KEY, \`name\` TEXT NOT NULL UNIQUE, \`month\`  INTEGER NOT NULL, \`year\` INTEGER NOT NULL, \`batch\` TEXT NOT NULL, \`winners\` JSON NOT NULL)`),
                db.run(`CREATE TABLE \`cheats\` (\`CID\` INTEGER NOT NULL PRIMARY KEY, \`GID\` INTEGER NOT NULL, \`UID\` INTEGER NOT NULL, \`no_of_cheats\` REAL NOT NULL ${monthColumns}, FOREIGN KEY (\`GID\`) REFERENCES \`groups\` ( \`GID\` ), FOREIGN KEY (\`UID\`) REFERENCES \`users\` (\`UID\`) )`),
            ]);
        });
    }
    await db.run("PRAGMA foreign_keys=ON;");
    console.log("Connected to the database");
}
exports.start = start;
async function createUser(userName, phone, address) {
    let result;
    let success;
    try {
        await db.run("INSERT INTO `USERS` (`name`, `phone`, `address`) VALUES (?, ?, ?);", [userName, phone, address]);
        result = await db.get("SELECT * FROM `users` WHERE `phone`= ?;", [phone]);
    }
    catch (err) {
        success = false;
        if (err.errno === 19) {
            console.log(err);
        }
        else {
            throw err;
        }
    }
    return { result, success };
}
exports.createUser = createUser;
async function createGroup(year, month, batch, members) {
    let result;
    let success;
    let gName = year + "-" + month + "-" + batch;
    let total = 0;
    for (const member of members) {
        total += member.noOfCheats;
    }
    if (total !== 20) {
        throw new Error("Total number of cheats is not equal to 20");
    }
    try {
        await db.run("INSERT INTO `groups` (`name`, `year`, `month`, `batch`, `winners`) VALUES (?, ?, ?, ?, '[]');", [gName, year, month, batch]);
        result = await db.get("SELECT * FROM `groups` WHERE `name` = '" + gName + "';");
    }
    catch (err) {
        success = false;
        if (err.errno === 19) {
            console.log(err);
        }
        else {
            throw err;
        }
        throw err;
    }
    if (success) {
        db.transaction(function (db1) {
            let iterable = [];
            for (const member of members) {
                iterable.push(db1.run("INSERT INTO `cheats` (`UID`, `GID`, `no_of_cheats`, `month1_toBePaid`) VALUES (?, ?, ?)", [member.UID, result.GID, member.noOfCheats, 5000 * member.noOfCheats]));
            }
            return Promise.all(iterable);
        });
    }
    return { success, result };
}
exports.createGroup = createGroup;
async function listUsers() {
    let result = await db.all("SELECT * FROM `users`");
    return result;
}
exports.listUsers = listUsers;
async function listGroups() {
    let result;
    result = await db.all("SELECT * FROM `groups`");
    result.forEach((group, index) => {
        group.winners = JSON.parse(group.winners);
    });
    return result;
}
exports.listGroups = listGroups;
async function closeDB() {
    console.log("Closing database connections");
    await db.close();
}
exports.closeDB = closeDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmNEYXRhYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hc3luY0RhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFpQztBQUNqQywrQkFBNEI7QUFDNUIsdUNBQStCO0FBQy9CLDJCQUE0QjtBQUM1QiwrQkFBaUM7QUFDakMsTUFBTSxPQUFPLEdBQUcsZ0JBQVMsQ0FBQyxXQUFNLENBQUMsQ0FBQztBQUNsQyxNQUFNLE1BQU0sR0FBVyxXQUFJLENBQUMsY0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNsRSxJQUFJLEVBQUUsR0FBRyxJQUFJLGlCQUFRLEVBQUUsQ0FBQztBQUV4QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXhDLEtBQUssVUFBVSxLQUFLO0lBQ2xCLElBQUksTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFFekIsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3ZCO1NBQU07UUFFTCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDeEMsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsWUFBWSxJQUFJLFVBQVUsR0FBRyxDQUFDLEdBQUcsb0JBQW9CLENBQUM7WUFDdEQsWUFBWSxJQUFJLFVBQVUsR0FBRyxDQUFDLEdBQUcsa0JBQWtCLENBQUM7U0FDckQ7UUFFRCxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHO1lBQ2hDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQztnQkFDakIs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