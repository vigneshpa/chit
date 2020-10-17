"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("./sqlite3");
const fs_1 = require("fs");
class Dbmgmt {
    constructor(dbFile) {
        this.db = new sqlite3_1.default();
        this.dbFile = dbFile;
        console.log("Stroing data at ", this.dbFile);
    }
    async connect() {
        var _a;
        let exists = false;
        try {
            exists = (_a = (await fs_1.promises.stat(this.dbFile))) === null || _a === void 0 ? void 0 : _a.isFile();
        }
        catch (e) {
            exists = false;
            console.log(e);
        }
        if (!exists)
            return false;
        await this.db.open(this.dbFile);
        await this.db.run("PRAGMA foreign_keys=ON;");
        console.log("Connected to the database");
        return true;
    }
    async createDB() {
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
        console.log("Created new database");
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
        if (this.db.db)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGJtZ210LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0RibWdtdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpQztBQUNqQywyQkFBOEI7QUFFOUIsTUFBTSxNQUFNO0lBR1YsWUFBWSxNQUFjO1FBQ3hCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxpQkFBUSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNELEtBQUssQ0FBQyxPQUFPOztRQUNYLElBQUksTUFBTSxHQUFZLEtBQUssQ0FBQztRQUM1QixJQUFJO1lBQ0YsTUFBTSxTQUFHLENBQUMsTUFBTSxhQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQywwQ0FBRSxNQUFNLEVBQUUsQ0FBQztTQUN2RDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7UUFDRCxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRTFCLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDekMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVE7UUFFWixNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxNQUFN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