import Database from "./sqlite3";
import { join } from "path";
import { app } from "electron";
import { exists } from "fs";
import { promisify } from "util";
const existsP = promisify(exists);
const dbFile: string = join(app.getPath("userData"), "./main.db");
let db = new Database();

async function start(): Promise<void> {
  if (await existsP(dbFile)) {
    //If database file exists connecting to it.
    await db.open(dbFile);
  } else {
    //If database file does not exixts creating it and structuring it.
    await db.open(dbFile);
    await db.run("PRAGMA foreign_keys=ON;");
    let monthColumns: string = "";
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
export { start };

async function createUser(userName: string, phone: string, address?: string): Promise<{ success: boolean; result: createUserFields }> {
  let result: createUserFields;
  let success: boolean;

  try {
    await db.run("INSERT INTO `USERS` (`name`, `phone`, `address`) VALUES (?, ?, ?);", [userName, phone, address]);
    result = await db.get("SELECT * FROM `users` WHERE `phone`= ?;", [phone]);
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
export { createUser };

async function createGroup(year:number, month:number, batch:string, members:{UID:number, noOfCheats:number}[]): Promise<{ success: boolean; result: createGroupFields }> {
  let result: createGroupFields;
  let success: boolean;
  let gName: string = year + "-" + month + "-" + batch;
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
  }catch(err){
    success = false;
    throw err;
  }

  if(success){
    db.transaction(function(db1){
      let iterable:Promise<any>[] = [];
      for (const member of members) {
        iterable.push(db1.run("INSERT INTO `cheats` (`UID`, `GID`, `no_of_cheats`, `month1_toBePaid`) VALUES (?, ?, ?)", [member.UID, result.GID, member.noOfCheats, 5000 * member.noOfCheats]));
      }
      return Promise.all(iterable);
    });
  }

  return { success, result };
}
export { createGroup };

async function listUsers():Promise<createUserFields[]>{
  let result:createUserFields[] = await db.all("SELECT * FROM `users`");
  return result;
}
export {listUsers};

async function listGroups():Promise<createGroupFields[]>{
  let result:createGroupFields[];
  result = await db.all("SELECT * FROM `groups`");
  result.forEach((group, index)=>{
    group.winners = JSON.parse(<string>(<unknown>group.winners));
  });
  return result;
}
export {listGroups};

async function closeDB(){
  await db.close();
}
export {closeDB};