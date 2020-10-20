"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("./sqlite3");
const fs_1 = require("fs");
const fs_2 = require("fs");
const util_1 = require("util");
const readFileP = util_1.promisify(fs_2.readFile);
class Dbmgmt {
    constructor(dbFile) {
        this.db = new sqlite3_1.default();
        this.dbFile = dbFile;
        console.log("Stroing data at ", this.dbFile);
        this.today = new Date();
    }
    async connect() {
        var _a;
        let exists = false;
        try {
            exists = (_a = (await fs_1.promises.stat(this.dbFile))) === null || _a === void 0 ? void 0 : _a.isFile();
        }
        catch (e) {
            exists = false;
            console.log("Unable to connect to the database file!It may not exists!");
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
        let sql = await readFileP("./app/sql/create.sql");
        await this.db.transaction(async function (db1) {
            await db1.run(sql.toString());
        });
        console.log("Created new database");
    }
    async closeDB() {
        console.log("Closing database connections");
        if (this.db.db)
            await this.db.close();
    }
    async checkPhone(phone) {
        let sql = readFileP("./app/checkPhone.sql");
        let result = await this.db.get((await sql).toString(), { $phone: phone });
        if (result.phone === phone)
            return true;
        return false;
    }
    async createUser(userName, phone, address) {
        let result;
        let success;
        let sql = readFileP("./app/sql/createUser.sql");
        try {
            result = await this.db.get((await sql).toString(), { $name: userName, $phone: phone, $address: address });
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
    async checkBatch(batch, month, year) {
        let sql = readFileP("./app/sql/checkBatch.sql");
        let result = await this.db.get((await sql).toString(), { $batch: batch, $month: month, $year: year });
        if (result.batch === batch)
            return true;
        return false;
    }
    async createGroup(year, month, batch, members) {
        let result;
        let success = true;
        let gName = `${year}-${month}-${batch}`;
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
    async userDetails(UID) {
        let userInfo = await this.db.get("SELECT * FROM `users` WHERE `UID` = ?", UID);
        let userDetails = {
            ...userInfo,
            unpaid: [],
            groups: [],
            chits: [],
            oldChits: [],
            noOfActiveBatches: 0,
            totalNoChits: 0,
            withdrawedChits: 0,
        };
        let chits = [];
        let chitsRaw = await this.db.all("SELECT * FROM `chits` LEFT JOIN `groups` ON `chits`.`GID` = `groups`.`GID` WHERE UID = ?", [UID]);
        chitsRaw.forEach(chitRaw => {
            let payments = [];
            for (let i = 1; i <= 20; i++) {
                payments.push({
                    month: i,
                    toBePaid: chitRaw["month" + i + "_toBePaid"],
                    isPaid: chitRaw["month" + i + "_isPaid"],
                });
            }
            chits.push({
                CID: chitRaw.CID,
                GID: chitRaw.GID,
                UID: chitRaw.UID,
                name: chitRaw.name,
                batch: chitRaw.batch,
                month: chitRaw.month,
                year: chitRaw.year,
                payments
            });
        });
        chits.forEach(chit => {
            userDetails.groups.push(chit.GID);
            let todayMonths = this.today.getMonth() + (this.today.getFullYear() * 12);
            let chitMonths = chit.month + (chit.year * 12);
            let chitAge = todayMonths - chitMonths + 1;
        });
    }
    async analyseDB() {
        let groups = await this.listGroups();
        groups.forEach(group => {
        });
    }
}
exports.default = Dbmgmt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGJtZ210LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0RibWdtdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpQztBQUNqQywyQkFBOEI7QUFDOUIsMkJBQThCO0FBQzlCLCtCQUFpQztBQUNqQyxNQUFNLFNBQVMsR0FBRyxnQkFBUyxDQUFDLGFBQVEsQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sTUFBTTtJQUlWLFlBQVksTUFBYztRQUN4QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksaUJBQVEsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBQ0QsS0FBSyxDQUFDLE9BQU87O1FBQ1gsSUFBSSxNQUFNLEdBQVksS0FBSyxDQUFDO1FBQzVCLElBQUk7WUFDRixNQUFNLFNBQUcsQ0FBQyxNQUFNLGFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLDBDQUFFLE1BQU0sRUFBRSxDQUFDO1NBQ3ZEO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1lBQ3pFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7UUFDRCxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRTFCLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUM3QyxP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