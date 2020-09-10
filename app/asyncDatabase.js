"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.start = void 0;
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
                db.run(`CREATE TABLE
          \`users\` (\`UID\` INTEGER NOT NULL PRIMARY KEY, \`name\` TEXT NOT NULL, \`phone\` TEXT NOT NULL UNIQUE, \`address\` TEXT)`),
                db.run(`CREATE TABLE
          \`groups\` (\`GID\` INTEGER NOT NULL PRIMARY KEY, \`name\` TEXT NOT NULL UNIQUE, \`month\`  INTEGER NOT NULL, \`year\` INTEGER NOT NULL, \`batch\` TEXT NOT NULL, \`winners\` JSON NOT NULL)`),
                db.run(`CREATE TABLE
          \`cheats\` (\`CID\` INTEGER NOT NULL PRIMARY KEY, \`GID\` INTEGER NOT NULL, \`UID\` INTEGER NOT NULL, \`no_of_cheats\` REAL NOT NULL` +
                    monthColumns +
                    `, FOREIGN KEY (\`GID\`) REFERENCES \`groups\` ( \`GID\` ), FOREIGN KEY (\`UID\`) REFERENCES \`users\` (\`UID\`) )`),
            ]);
        });
    }
    await db.run("PRAGMA foreign_keys=ON;");
}
exports.start = start;
async function createUser(userName, phone, address) {
    let result;
    await db.run("INSERT INTO `USERS` (`name`, `phone`, `address`) VALUES (?, ?, ?);", [userName, phone, address]);
    return result;
}
exports.createUser = createUser;
