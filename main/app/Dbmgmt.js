"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("./sqlite3");
const fs_1 = require("fs");
const util_1 = require("util");
class Dbmgmt {
    constructor(dbFile) {
        this.db = new sqlite3_1.default();
        this.dbFile = dbFile;
    }
    async start() {
        console.log("Stroing data at ", this.dbFile);
        const existsP = util_1.promisify(fs_1.exists);
        if (await existsP(this.dbFile)) {
            await this.db.open(this.dbFile);
        }
        else {
            await this.db.open(this.dbFile);
            await this.db.run("PRAGMA foreign_keys=ON;");
            let monthColumns = "";
            for (let i = 1; i <= 20; i++) {
                monthColumns += ", `month" + i + "_toBePaid` INTEGER";
                monthColumns += ", `month" + i + "_isPaid` INTEGER";
            }
            await this.db.transaction(function (db1) {
                return Promise.all([
                    db1.run(`CREATE TABLE \`users\` (\`UID\` INTEGER NOT NULL PRIMARY KEY, \`name\` TEXT NOT NULL, \`phone\` TEXT NOT NULL UNIQUE, \`address\` TEXT)`),
                    db1.run(`CREATE TABLE \`groups\` (\`GID\` INTEGER NOT NULL PRIMARY KEY, \`name\` TEXT NOT NULL UNIQUE, \`month\`  INTEGER NOT NULL, \`year\` INTEGER NOT NULL, \`batch\` TEXT NOT NULL, \`winners\` JSON NOT NULL)`),
                    db1.run(`CREATE TABLE \`chits\` (\`CID\` INTEGER NOT NULL PRIMARY KEY, \`GID\` INTEGER NOT NULL, \`UID\` INTEGER NOT NULL, \`no_of_chits\` REAL NOT NULL ${monthColumns}, FOREIGN KEY (\`GID\`) REFERENCES \`groups\` ( \`GID\` ), FOREIGN KEY (\`UID\`) REFERENCES \`users\` (\`UID\`) )`),
                ]);
            });
        }
        await this.db.run("PRAGMA foreign_keys=ON;");
        console.log("Connected to the database");
    }
    async createUser(userName, phone, address) {
        let result;
        let success;
        try {
            await this.db.run("INSERT INTO `USERS` (`name`, `phone`, `address`) VALUES (?, ?, ?);", [userName, phone, address]);
            result = await this.db.get("SELECT * FROM `users` WHERE `phone`= ?;", [phone]);
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
    async createGroup(year, month, batch, members) {
        let result;
        let success = true;
        let gName = year + "-" + month + "-" + batch;
        let total = 0;
        for (const member of members) {
            total += member.noOfChits;
        }
        if (total !== 20) {
            throw new Error("Total number of chits is not equal to 20");
        }
        try {
            await this.db.run("INSERT INTO `groups` (`name`, `year`, `month`, `batch`, `winners`) VALUES (?, ?, ?, ?, '[]');", [gName, year, month, batch]);
            result = await this.db.get("SELECT * FROM `groups` WHERE `name` = '" + gName + "';");
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
            await this.db.transaction(function (db1) {
                let iterable = [];
                for (const member of members) {
                    iterable.push(db1.run("INSERT INTO `chits` (`UID`, `GID`, `no_of_chits`, `month1_toBePaid`) VALUES (?, ?, ?, ?)", [member.UID, result.GID, member.noOfChits, 5000 * member.noOfChits]));
                }
                return Promise.all(iterable);
            });
        }
        return { success, result };
    }
    async listUsers() {
        let result = await this.db.all("SELECT * FROM `users`");
        return result;
    }
    async listGroups() {
        let result;
        result = await this.db.all("SELECT * FROM `groups`");
        result.forEach((group, index) => {
            group.winners = JSON.parse(group.winners);
        });
        return result;
    }
    async closeDB() {
        console.log("Closing database connections");
        await this.db.close();
    }
    async checkPhone(phone) {
        let result = await this.db.get("SELECT `phone` FROM `users` WHERE `phone`=?", phone);
        if (result.phone === phone)
            return true;
        return false;
    }
    async checkBatch(batch, month, year) {
        let result = await this.db.get("SELECT `batch` FROM `groups` WHERE `batch`=? AND `month`=? AND `year`=?", batch, month, year);
        if (result.batch === batch)
            return true;
        return false;
    }
}
exports.default = Dbmgmt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGJtZ210LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0RibWdtdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpQztBQUNqQywyQkFBNEI7QUFDNUIsK0JBQWlDO0FBR2pDLE1BQU0sTUFBTTtJQUdWLFlBQVksTUFBYTtRQUN2QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksaUJBQVEsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLGdCQUFTLENBQUMsV0FBTSxDQUFDLENBQUM7UUFDbEMsSUFBSSxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFFOUIsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakM7YUFBTTtZQUVMLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUM3QyxJQUFJLFlBQVksR0FBVyxFQUFFLENBQUM7WUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDNUIsWUFBWSxJQUFJLFVBQVUsR0FBRyxDQUFDLEdBQUcsb0JBQW9CLENBQUM7Z0JBQ3RELFlBQVksSUFBSSxVQUFVLEdBQUcsQ0FBQyxHQUFHLGtCQUFrQixDQUFDO2FBQ3JEO1lBRUQsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEdB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