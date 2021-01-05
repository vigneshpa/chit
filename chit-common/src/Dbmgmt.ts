import { promises, unlinkSync, readFile } from "fs";
import { promisify } from "util";
import { join } from "path";
import ChitORM from "chitorm";
export default class Dbmgmt {
  orm: ChitORM;
  dbFile: string;
  today: Date;
  constructor(dbFile: string, orm?: ChitORM) {
    this.dbFile = dbFile;
    console.log("Stroing data at ", this.dbFile);
    this.today = new Date();
    this.orm = new ChitORM({ type: "sqlite", file: this.dbFile });
  }

  async connect() {
    let exists: boolean = false;
    try {
      exists = (await promises.stat(this.dbFile))?.isFile();
    } catch (e) {
      exists = false;
      console.log("Error is thrown when checking existance od db", e);
    }
    if (!exists) return false;
    //If database file exists connecting to it.
    await this.orm.connect();
    await this.orm.run("PRAGMA foreign_keys=ON;");
    console.log("Connected to the database");
    return true;
  }
  async closeDB() {
    if (this.orm.connection) await this.orm.connection.close();
    console.log("Database connections closed");
  }



  async runQuery(query: "checkPhone", phone: string): Promise<boolean>;
  async runQuery(query: "createUser", userName: string, phone: string, address?: string): Promise<{ success: boolean; result: createUserFields }>;
  async runQuery(query: "checkBatch", batch: string, month: number, year: number): Promise<boolean>;
  async runQuery(query: "createGroup", year: number, month: number, batch: string, members: { UID: number, no_of_chits: number }[]): Promise<{ success: boolean; result: createGroupFields }>;
  async runQuery(query: "listUsers"): Promise<userInfo[]>;
  async runQuery(query: "listGroups"): Promise<GroupInfo[]>;
  async runQuery(query: "userDetails", UID: number): Promise<userInfoExtended>;
  async runQuery(query: string, ...args: any[]): Promise<any>;
  async runQuery(query: ("checkPhone" | "createUser" | "checkBatch" | "createGroup" | "listUsers" | "listGroups" | "userDetails" | "analyseDB" | string), ...args: any[]): Promise<any> {
    switch (query) {

      case "checkPhone": {
        const phone: string = args[0];
        //result = await this.db.get(sql.toString(), { $phone: phone });
        let result = await this.orm.manager.user.findOne({ phone })
        if (result?.phone === phone) return true;
        return false;
      }

      case "createUser": {
        const name: string = args[0], phone: string = args[1], address: string = args[2];
        let result: createUserFields;
        let success: boolean;
        let user = new this.orm.User({ name, phone, address });

        this.orm.connection.manager.transaction(async manager => {
          result = await manager.save(user);
        });

        return { result, success };
      }

      //async checkBatch(batch: string, month: number, year: number) 
      case "checkBatch": {
        const batch: string = args[0], month: number = args[1], year: number = args[2];
        //let result = await this.db.get(sql.toString(), { $batch: batch, $month: month, $year: year });
        let result = await this.orm.manager.group.findOne({ batch, month, year });
        if (result?.batch === batch) return true;
        return false;
      }

      //async createGroup(year: number, month: number, batch: string, members: { UID: number, no_of_chits: number }[]): Promise<{ success: boolean; result: createGroupFields }>
      case "createGroup": {
        const year: number = args[0], month: number = args[1], batch: string = args[2], members: { UUID: string, noOfChits: number }[] = args[3];
        let result: GroupInfoExtended | null = null;
        let gName: string = `${year}-${month}-${batch}`;
        let total = 0;
        for (const member of members) {
          total += member.no_of_chits;
        }
        if (total !== 20) {
          throw new Error("Total number of chits is not equal to 20");
        }

        //Creating group Object
        const group = new this.orm.Group({ name: gName, batch, month, year, chits: [] });
        for (const member of members) {
          const user = await this.orm.manager.user.findOne({ uuid: member.UUID });
          group.chits.push(new this.orm.Chit({ user, group, noOfChits: member.noOfChits }));
          for (let i = 1; i <= 20; i++) {
            
          }
        }

        //Starting transaction
        this.orm.connection.manager.transaction(async manager => {
          await manager.save(group);
        });
        //ERROR handeling
        try {

          //Adding members
          for (const member of members) {
            let memberInfo: ChitInfo = (await this.db.getMultiple(createChitSQL.toString(), [{ $UID: member.UID, $GID: group.GID, $no_of_chits: member.no_of_chits }], [{ $UID: member.UID, $GID: group.GID }]))[1];
            memberInfo.payments = [];

            //Adding payments
            for (let i = 1; i <= 20; i++) {
              memberInfo.payments.push(await this.db.getMultiple(createPaymentSQL.toString(), [{ $CID: memberInfo.CID, $nmonth: i, $to_be_paid: memberInfo.no_of_chits * 5000 }], [{ $CID: memberInfo.CID, $nmonth: i }])[0]);
            }
            membersInfo.push(memberInfo);
          }
          result = { ...group, members: membersInfo };
        } catch (e) {
          //If any ERROR occoured
          console.log(e);

          //Rolling back changes
          this.db.exec("ROLLBACK TRANSACTION");

          //Setting success to false

          //returning
          return { success: false, result };
        }
        //Commiting transaction
        this.db.exec("END TRANSACTION");

        console.log(result);
        return { success: true, result };
      }
      //async listUsers(): Promise<userInfo[]>
      case "listUsers": {
        let result: userInfo[] = await this.db.all("SELECT * FROM `users`");
        return result;
      }
      //async listGroups(): Promise<GroupInfo[]>
      case "listGroups": {
        let result: GroupInfo[];
        result = await this.db.all("SELECT * FROM `groups`");
        result.forEach((group, index) => {
          group.winners = JSON.parse(<string>(<unknown>group.winners ? group.winners : "[]"));
        });
        return result;
      }
      //async userDetails(UID: number): Promise<userInfoExtended>
      case "userDetails": {
        const UID: number = args[0];
        let userInfo: userInfo = await this.db.get("SELECT * FROM `users` WHERE `UID` = ?", UID);
        let userDetails: userInfoExtended = {
          ...userInfo,
          unpaid: [] as number[],
          groups: [] as number[],
          chits: [] as ChitInfo[],
          oldChits: [] as ChitInfo[],
          noOfActiveBatches: 0,
          totalNoChits: 0,
          withdrawedChits: 0,
        };
        let chits: ChitInfo[] = [];
        let chitsRaw: ChitInfoRaw[] = await this.db.all("SELECT * FROM `chits` LEFT JOIN `groups` ON `chits`.`GID` = `groups`.`GID` WHERE UID = ?", [UID]);

        chitsRaw.forEach(chitRaw => {
          let payments: ChitInfo["payments"] = [];
          for (let i = 1; i <= 20; i++) {
            payments.push({
              month: i,
              to_be_paid: <number>chitRaw["month" + i + "_to_be_paid"],
              is_paid: <boolean>chitRaw["month" + i + "_isPaid"],
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
          if (!userDetails.groups.includes(chit.GID)) userDetails.groups.push(chit.GID);
          let todayMonths = this.today.getMonth() + (this.today.getFullYear() * 12);
          let chitMonths = chit.month + (chit.year * 12);
          let chitAge = todayMonths - chitMonths + 1;
          /**
           * If the group is older than 20 months
           */
          if (chitAge > 20) {
            userDetails.oldChits.push(chit);
          } else {
            userDetails.chits.push(chit);
          }
        });
        return userDetails;
      }
      //async analyseDB()
      case "analyseDB": { }
    }
  }
}
async function getSQL(file: string) {
  let sql = await promisify(readFile)(join(__dirname, file));
  console.log("Got SQL:", sql.toString());
  return sql;
}