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
        console.log("Creating a new database");
        try {
            await this.db.runMultiple(sql.toString());
        }
        catch (e) {
            fs_1.unlinkSync(this.dbFile);
            console.log("Unable to create database file");
            console.log(e);
            process.kill(1);
        }
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
            result = (await this.db.getMultiple((await sql).toString(), [{ $name: userName, $phone: phone, $address: address }], [{ $phone: phone }]))[1];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGJtZ210LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0RibWdtdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpQztBQUNqQywyQkFBa0Q7QUFDbEQsMkJBQThCO0FBQzlCLCtCQUFpQztBQUVqQyxNQUFNLFNBQVMsR0FBRyxnQkFBUyxDQUFDLGFBQVEsQ0FBQyxDQUFDO0FBRXRDLE1BQU0sTUFBTTtJQUlWLFlBQVksTUFBYztRQUN4QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksaUJBQVEsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBQ0QsS0FBSyxDQUFDLE9BQU87O1FBQ1gsSUFBSSxNQUFNLEdBQVksS0FBSyxDQUFDO1FBQzVCLElBQUk7WUFDRixNQUFNLFNBQUcsQ0FBQyxNQUFNLGFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLDBDQUFFLE1BQU0sRUFBRSxDQUFDO1NBQ3ZEO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1lBQ3pFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7UUFDRCxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRTFCLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDekMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVE7UUFFWixNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDN0MsSUFBSSxHQUFHLEdBQUcsTUFBTSxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDdkMsSUFBSTtZQUNGLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDM0M7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLGVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFDRCxLQUFLLENBQUMsT0FBTztRQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUM1QyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUFFLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBQ0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFhO1FBQzVCLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzVDLElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDMUUsSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLEtBQUs7WUFBRSxPQUFPLElBQUksQ0FBQztRQUN4QyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQWdCLEVBQUUsS0FBYSxFQUFFLE9BQWdCO1FBQ2hFLElBQUksTUFBd0IsQ0FBQztRQUM3QixJQUFJLE9BQWdCLENBQUM7UUFDckIsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFFaEQsSUFBSTtZQUVGLE1BQU0sR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1STtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNoQixJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFO2dCQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLE1BQU0sR0FBRyxDQUFDO2FBQ1g7U0FDRjtRQUVELE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUNELEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBYSxFQUFFLEtBQWEsRUFBRSxJQUFZO1FBQ3pELElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ2hELElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3RHLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxLQUFLO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDeEMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQ0QsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLEtBQWEsRUFBRSxPQUE2QztRQUN6RyxJQUFJLE1BQXlCLENBQUM7UUFDOUIsSUFBSSxPQUFPLEdBQVksSUFBSSxDQUFDO1FBQzVCLElBQUksS0FBSyxHQUFXLEdBQUcsSUFBSSxJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUNoRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUM1QixLQUFLLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQztTQUMzQjtRQUNELElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7U0FDN0Q7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMseUNBQXlDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekYsSUFBSTtZQUNGLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsK0ZBQStGLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2hKLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztTQUN0RjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNoQixJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFO2dCQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLE1BQU0sR0FBRyxDQUFDO2FBQ1g7WUFDRCxNQUFNLEdBQUcsQ0FBQztTQUNYO1FBRUQsSUFBSSxPQUFPLEVBQUU7WUFDWCxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssV0FBVyxHQUFHO2dCQUMzQyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtvQkFDNUIsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLDJGQUEyRixFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUNqTDtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFDRCxLQUFLLENBQUMsU0FBUztRQUNiLElBQUksTUFBTSxHQUFlLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNwRSxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0QsS0FBSyxDQUFDLFVBQVU7UUFDZCxJQUFJLE1BQTJCLENBQUM7UUFDaEMsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQzlCLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBbUIsS0FBSyxDQUFDLE9BQVEsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBVztRQUMzQixJQUFJLFFBQVEsR0FBYSxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pGLElBQUksV0FBVyxHQUFxQjtZQUNsQyxHQUFHLFFBQVE7WUFDWCxNQUFNLEVBQUUsRUFBYztZQUN0QixNQUFNLEVBQUUsRUFBYztZQUN0QixLQUFLLEVBQUUsRUFBd0I7WUFDL0IsUUFBUSxFQUFFLEVBQXdCO1lBQ2xDLGlCQUFpQixFQUFFLENBQUM7WUFDcEIsWUFBWSxFQUFFLENBQUM7WUFDZixlQUFlLEVBQUUsQ0FBQztTQUNuQixDQUFDO1FBQ0YsSUFBSSxLQUFLLEdBQXVCLEVBQUUsQ0FBQztRQUNuQyxJQUFJLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQywwRkFBMEYsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFekosUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN6QixJQUFJLFFBQVEsR0FBaUMsRUFBRSxDQUFDO1lBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVCLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQ1osS0FBSyxFQUFFLENBQUM7b0JBQ1IsUUFBUSxFQUFVLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztvQkFDcEQsTUFBTSxFQUFXLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztpQkFDbEQsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUNULEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRztnQkFDaEIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHO2dCQUNoQixHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7Z0JBQ2hCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtnQkFDbEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO2dCQUNwQixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7Z0JBQ3BCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtnQkFDbEIsUUFBUTthQUNULENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQixXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDMUUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDL0MsSUFBSSxPQUFPLEdBQUcsV0FBVyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFpQkwsQ0FBQztJQUNELEtBQUssQ0FBQyxTQUFTO1FBQ2IsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUV2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELGtCQUFlLE1BQU0sQ0FBQyJ9