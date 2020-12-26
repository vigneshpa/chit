"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("./sqlite3");
const fs_1 = require("fs");
const fs_2 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
require("chit-common");
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
            console.log("Unable to connect to the database file! It may not exists!");
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
        let sql = await readFileP(path_1.join(__dirname, "./sql/create.sql"));
        console.log("Creating a new database");
        this.db.exec("BEGIN TRANSACTION;");
        try {
            await this.db.runMultiple(sql.toString());
        }
        catch (e) {
            await this.db.exec("ROLLBACK TRANSACTION");
            await this.db.close();
            fs_1.unlinkSync(this.dbFile);
            console.log("Unable to create database file");
            console.log(e);
            process.kill(1);
        }
        this.db.exec("END TRANSACTION;");
        console.log("Created new database");
    }
    async closeDB() {
        if (this.db.db)
            await this.db.close();
        console.log("Database connections closed");
    }
    async checkPhone(phone) {
        let sql = await readFileP(path_1.join(__dirname, "./sql/checkPhone.sql"));
        let result = await this.db.get(sql.toString(), { $phone: phone });
        if (result.phone === phone)
            return true;
        return false;
    }
    async createUser(userName, phone, address) {
        let result;
        let success;
        let sql = await readFileP(path_1.join(__dirname, "./sql/createUser.sql"));
        this.db.exec("BEGIN TRANSACTION");
        try {
            result = (await this.db.getMultiple(sql.toString(), [{ $name: userName, $phone: phone, $address: address }], [{ $phone: phone }]))[1];
        }
        catch (err) {
            this.db.exec("ROLLBACK TRANSACTION");
            success = false;
            if (err.errno === 19) {
                console.log(err);
            }
            else {
                throw err;
            }
        }
        this.db.exec("END TRANSACTION");
        return { result, success };
    }
    async checkBatch(batch, month, year) {
        let sql = await readFileP(path_1.join(__dirname, "./sql/checkBatch.sql"));
        let result = await this.db.get(sql.toString(), { $batch: batch, $month: month, $year: year });
        if (result.batch === batch)
            return true;
        return false;
    }
    async createGroup(year, month, batch, members) {
        let result = null;
        let gName = `${year}-${month}-${batch}`;
        let total = 0;
        for (const member of members) {
            total += member.no_of_chits;
        }
        if (total !== 20) {
            throw new Error("Total number of chits is not equal to 20");
        }
        const createGroupSQL = await readFileP(path_1.join(__dirname, "./sql/createGroup.sql"));
        const createChitSQL = await readFileP(path_1.join(__dirname, "./sql/createChit.sql"));
        const createPaymentSQL = await readFileP(path_1.join(__dirname, "./sql/createChitPayment.sql"));
        this.db.exec("BEGIN TRANSACTION");
        try {
            let group = (await this.db.getMultiple(createGroupSQL.toString(), [{ $name: gName, $batch: batch, $month: month, $year: year }], [{ $name: gName }]))[1];
            let membersInfo = [];
            for (const member of members) {
                let memberInfo = (await this.db.getMultiple(createChitSQL.toString(), [{ $UID: member.UID, $GID: group.GID, $no_of_chits: member.no_of_chits }], [{ $UID: member.UID, $GID: group.GID }]))[1];
                memberInfo.payments = [];
                for (let i = 1; i <= 20; i++) {
                    memberInfo.payments.push(await this.db.getMultiple(createPaymentSQL.toString(), [{ $CID: memberInfo.CID, $nmonth: i, $to_be_paid: memberInfo.no_of_chits * 5000 }], [{ $CID: memberInfo.CID, $nmonth: i }])[0]);
                }
                membersInfo.push(memberInfo);
            }
            result = { ...group, members: membersInfo };
        }
        catch (e) {
            console.log(e);
            this.db.exec("ROLLBACK TRANSACTION");
            return { success: false, result };
        }
        this.db.exec("END TRANSACTION");
        console.log(result);
        return { success: true, result };
    }
    async listUsers() {
        let result = await this.db.all("SELECT * FROM `users`");
        return result;
    }
    async listGroups() {
        let result;
        result = await this.db.all("SELECT * FROM `groups`");
        result.forEach((group, index) => {
            group.winners = JSON.parse((group.winners ? group.winners : "[]"));
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
                    to_be_paid: chitRaw["month" + i + "_to_be_paid"],
                    is_paid: chitRaw["month" + i + "_isPaid"],
                });
            }
            chits.push({
                CID: chitRaw.CID,
                GID: chitRaw.GID,
                UID: chitRaw.UID,
                no_of_chits: chitRaw.no_of_chits,
                name: chitRaw.name,
                year: chitRaw.year,
                month: chitRaw.month,
                batch: chitRaw.batch,
                payments
            });
        });
        chits.forEach(chit => {
            userDetails.groups.push(chit.GID);
            let todayMonths = this.today.getMonth() + (this.today.getFullYear() * 12);
            let chitMonths = chit.month + (chit.year * 12);
            let chitAge = todayMonths - chitMonths + 1;
        });
        chits.forEach(chit => {
            if (!userDetails.groups.includes(chit.GID))
                userDetails.groups.push(chit.GID);
            let todayMonths = this.today.getMonth() + (this.today.getFullYear() * 12);
            let chitMonths = chit.month + (chit.year * 12);
            let chitAge = todayMonths - chitMonths + 1;
            if (chitAge > 20) {
                userDetails.oldChits.push(chit);
            }
            else {
                userDetails.chits.push(chit);
            }
        });
        return userDetails;
    }
    async analyseDB() {
        let groups = await this.listGroups();
        groups.forEach(group => {
        });
    }
}
exports.default = Dbmgmt;
