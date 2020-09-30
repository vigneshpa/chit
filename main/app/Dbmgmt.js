"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("./sqlite3");
const fs_1 = require("fs");
class Dbmgmt {
    constructor(dbFile) {
        this.db = new sqlite3_1.default();
        this.dbFile = dbFile;
    }
    async start() {
        var _a;
        console.log("Stroing data at ", this.dbFile);
        let exists = false;
        try {
            exists = (_a = (await fs_1.promises.stat(this.dbFile))) === null || _a === void 0 ? void 0 : _a.isFile();
        }
        catch (e) {
            exists = false;
        }
        if (exists) {
            await this.db.open(this.dbFile);
            await this.db.run("PRAGMA foreign_keys=ON;");
        }
        else {
            await this.db.open(this.dbFile);
            await this.db.run("PRAGMA foreign_keys=ON;");
            let monthColumns = "";
            for (let i = 1; i <= 20; i++) {
                monthColumns += ", `month" + i + "_toBePaid` INTEGER";
                monthColumns += ", `month" + i + "_isPaid` INTEGER";
            }
            await this.db.transaction(async function (db1) {
                await db1.run(`CREATE TABLE \`users\` (\`UID\` INTEGER NOT NULL PRIMARY KEY, \`name\` TEXT NOT NULL, \`phone\` TEXT NOT NULL UNIQUE, \`address\` TEXT)`);
                await db1.run(`CREATE TABLE \`groups\` (\`GID\` INTEGER NOT NULL PRIMARY KEY, \`name\` TEXT NOT NULL UNIQUE, \`month\`  INTEGER NOT NULL, \`year\` INTEGER NOT NULL, \`batch\` TEXT NOT NULL, \`winners\` JSON NOT NULL)`);
                await db1.run(`CREATE TABLE \`chits\` (\`CID\` INTEGER NOT NULL PRIMARY KEY, \`GID\` INTEGER NOT NULL, \`UID\` INTEGER NOT NULL, \`no_of_chits\` REAL NOT NULL ${monthColumns}, FOREIGN KEY (\`GID\`) REFERENCES \`groups\` ( \`GID\` ), FOREIGN KEY (\`UID\`) REFERENCES \`users\` (\`UID\`) )`);
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
        console.log(await this.db.get("SELECT * FROM `groups` WHERE `name` = '" + gName + "';"));
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
            await this.db.transaction(async function (db1) {
                for (const member of members) {
                    await db1.run("INSERT INTO `chits` (`UID`, `GID`, `no_of_chits`, `month1_toBePaid`) VALUES (?, ?, ?, ?);", [member.UID, result.GID, member.noOfChits, 5000 * member.noOfChits]);
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGJtZ210LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0RibWdtdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpQztBQUNqQywyQkFBOEI7QUFFOUIsTUFBTSxNQUFNO0lBR1YsWUFBWSxNQUFjO1FBQ3hCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxpQkFBUSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUNELEtBQUssQ0FBQyxLQUFLOztRQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksTUFBTSxHQUFXLEtBQUssQ0FBQztRQUMzQixJQUFHO1lBQ0QsTUFBTSxTQUFHLENBQUMsTUFBTSxhQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQywwQ0FBRSxNQUFNLEVBQUUsQ0FBQztTQUN2RDtRQUFBLE9BQU0sQ0FBQyxFQUFDO1lBQ1AsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksTUFBTSxFQUFFO1lBRVYsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEMsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzlDO2FBQU07WUFFTCxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDN0MsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDO1lBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFF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