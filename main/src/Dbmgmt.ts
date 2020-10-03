import Database from "./sqlite3";
import { promises } from "fs";

class Dbmgmt {
  db: Database;
  dbFile: string;
  constructor(dbFile: string) {
    this.db = new Database();
    this.dbFile = dbFile;
    console.log("Stroing data at ", this.dbFile);
  }
  async connect() {
    let exists: boolean = false;
    try {
      exists = (await promises.stat(this.dbFile))?.isFile();
    } catch (e) {
      exists = false;
      console.log(e);
    }
    if (!exists) return false;
    //If database file exists connecting to it.
    await this.db.open(this.dbFile);
    await this.db.run("PRAGMA foreign_keys=ON;");
    console.log("Connected to the database");
    return true;
  }
  async createDB() {
    //If database file does not exixts creating it and structuring it.
    await this.db.open(this.dbFile);
    await this.db.run("PRAGMA foreign_keys=ON;");

    let monthColumns: string = "";
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
  async createUser(userName: string, phone: string, address?: string): Promise<{ success: boolean; result: createUserFields }> {
    let result: createUserFields;
    let success: boolean;

    try {
      await this.db.run("INSERT INTO `USERS` (`name`, `phone`, `address`) VALUES (?, ?, ?);", [userName, phone, address]);
      result = await this.db.get("SELECT * FROM `users` WHERE `phone`= ?;", [phone]);
    } catch (err) {
      success = false;
      if (err.errno === 19) {
        console.log(err);
      } else {
        throw err;
      }
    }

    return { result, success };
  }
  async createGroup(year: number, month: number, batch: string, members: { UID: number, noOfChits: number }[]): Promise<{ success: boolean; result: createGroupFields }> {
    let result: createGroupFields;
    let success: boolean = true;
    let gName: string = year + "-" + month + "-" + batch;
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
    } catch (err) {
      success = false;
      if (err.errno === 19) {
        console.log(err);
      } else {
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
  async listUsers(): Promise<userInfo[]> {
    let result: userInfo[] = await this.db.all("SELECT * FROM `users`");
    return result;
  }
  async listGroups(): Promise<createGroupFields[]> {
    let result: createGroupFields[];
    result = await this.db.all("SELECT * FROM `groups`");
    result.forEach((group, index) => {
      group.winners = JSON.parse(<string>(<unknown>group.winners));
    });
    return result;
  }
  async closeDB() {
    console.log("Closing database connections");
    if(this.db.db)await this.db.close();
  }
  async checkPhone(phone: string) {
    let result = await this.db.get("SELECT `phone` FROM `users` WHERE `phone`=?", phone);
    if (result.phone === phone) return true;
    return false;
  }
  async checkBatch(batch: string, month: number, year: number) {
    let result = await this.db.get("SELECT `batch` FROM `groups` WHERE `batch`=? AND `month`=? AND `year`=?", batch, month, year);
    if (result.batch === batch) return true;
    return false;
  }
}

export default Dbmgmt;