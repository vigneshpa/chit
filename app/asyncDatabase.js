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
    await db.close();
}
exports.closeDB = closeDB;
