import Database from "./sqlite3";
import { promises } from "fs";
import { readFile } from "fs";
import { promisify } from "util";
const readFileP = promisify(readFile);
class Dbmgmt {
  db: Database;
  dbFile: string;
  today:Date;
  constructor(dbFile: string) {
    this.db = new Database();
    this.dbFile = dbFile;
    console.log("Stroing data at ", this.dbFile);
    this.today = new Date();
  }
  async connect() {
    let exists: boolean = false;
    try {
      exists = (await promises.stat(this.dbFile))?.isFile();
    } catch (e) {
      exists = false;
      console.log("Unable to connect to the database file!It may not exists!");
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
    let sql = await readFileP("./app/sql/create.sql");
    await this.db.transaction(async function(db1){
      await db1.run(sql.toString());
    });
    console.log("Created new database");
  }
  async closeDB() {
    console.log("Closing database connections");
    if(this.db.db)await this.db.close();
  }
  async checkPhone(phone: string) {
    let sql = readFileP("./app/checkPhone.sql");
    let result = await this.db.get((await sql).toString(), {$phone:phone});
    if (result.phone === phone) return true;
    return false;
  }
  async createUser(userName: string, phone: string, address?: string): Promise<{ success: boolean; result: createUserFields }> {
    let result: createUserFields;
    let success: boolean;
    let sql = readFileP("./app/sql/createUser.sql");

    try {
      //await this.db.run("INSERT INTO `USERS` (`name`, `phone`, `address`) VALUES (?, ?, ?);", [userName, phone, address]);
      result = await this.db.get((await sql).toString(), {$name:userName, $phone:phone, $address:address});
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
  async checkBatch(batch: string, month: number, year: number) {
    let sql = readFileP("./app/sql/checkBatch.sql");
    let result = await this.db.get((await sql).toString(), {$batch:batch, $month:month, $year:year});
    if (result.batch === batch) return true;
    return false;
  }
  async createGroup(year: number, month: number, batch: string, members: { UID: number, noOfChits: number }[]): Promise<{ success: boolean; result: createGroupFields }> {
    let result: createGroupFields;
    let success: boolean = true;
    let gName: string = `${year}-${month}-${batch}`;
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
  async userDetails(UID:number){
    let userInfo:userInfo = await this.db.get("SELECT * FROM `users` WHERE `UID` = ?", UID);
    let userDetails:userInfoExtended = {
      ...userInfo,
      unpaid:[] as number[],
      groups:[] as number[],
      chits:[] as ChitInfoExtended[],
      oldChits:[] as ChitInfoExtended[],
      noOfActiveBatches:0,
      totalNoChits:0,
      withdrawedChits:0,
    };
    let chits:ChitInfoExtended[] = [];
    let chitsRaw:ChitInfoWithGroup[] = await this.db.all("SELECT * FROM `chits` LEFT JOIN `groups` ON `chits`.`GID` = `groups`.`GID` WHERE UID = ?", [UID]);
    
    chitsRaw.forEach(chitRaw=>{
      let payments:ChitInfoExtended["payments"] = [];
      for(let i = 1; i <=20 ; i++){
        payments.push({
          month:i,
          toBePaid:<number>chitRaw["month"+i+"_toBePaid"],
          isPaid:<boolean>chitRaw["month"+i+"_isPaid"],
        });
      }
      chits.push({
        CID:chitRaw.CID,
        GID:chitRaw.GID,
        UID:chitRaw.UID,
        name:chitRaw.name,
        batch:chitRaw.batch,
        month:chitRaw.month,
        year:chitRaw.year,
        payments
      });
    });

    chits.forEach(chit=>{
      userDetails.groups.push(chit.GID);
      let todayMonths = this.today.getMonth()+(this.today.getFullYear()*12);
      let chitMonths = chit.month+(chit.year*12);
      let chitAge = todayMonths - chitMonths + 1;
    });

    // chits.forEach(chit=>{
    //   if(!userDetails.groups.includes(chit.GID))userDetails.groups.push(chit.GID);
    //   let todayMonths = this.today.getMonth()+(this.today.getFullYear()*12);
    //   let chitMonths = chit.month+(chit.year*12);
    //   let chitAge = todayMonths - chitMonths + 1;
    //   /**
    //    * If the group is older than 20 months
    //    */
    //   if(chitAge>20){
    //     for(let i=1; i<=20; i++){
    //       let toBePaid = chit.

    //     }
    //   }
    //});
  }
  async analyseDB(){
    let groups = await this.listGroups();
    groups.forEach(group=>{
      
    });
  }
}

export default Dbmgmt;