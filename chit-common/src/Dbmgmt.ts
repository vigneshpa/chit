import ChitORM from "./ChitORM";
type argsD = { query: "checkPhone", phone: string }
  | { query: "createUser", name: string, phone: string, address?: string }
  |{ query: "checkBatch", batch: string, month: number, year: number }
  |{ query: "createGroup", year: number, month: number, batch: string, members: { uuid: string, noOfChits: number }[] }
  |{ query: "listGroups" }
  |{ query: "listUsers" }
  |{ query: "userDetails", uuid: string }
export default class Dbmgmt {
  orm: ChitORM;
  today: Date;
  constructor(orm?: ChitORM) {
    this.today = new Date();
    this.orm = orm;
  }

  async connect() {
    await this.orm.connect();
    await this.orm.run("PRAGMA foreign_keys=ON;");
    console.log("Connected to the database");
    return true;
  }
  async closeDB() {
    if (this.orm.connection) await this.orm.connection.close();
    console.log("Database connections closed");
  }
  async runQuery(args:argsD): Promise<any> {
    switch (args.query) {

      case "checkPhone": {
        const phone: string = args.phone;
        //result = await this.db.get(sql.toString(), { $phone: phone });
        let result = await this.orm.manager.user.findOne({ phone })
        if (result?.phone === phone) return true;
        return false;
      }

      case "createUser": {
        const name: string = args.name, phone: string = args.phone, address: string = args.address;
        let result: UserD;
        let user = new ChitORM.User({ name, phone, address });

        this.orm.connection.manager.transaction(async manager => {
          result = await manager.save(user);
        });

        return result;
      }

      //async checkBatch(batch: string, month: number, year: number) 
      case "checkBatch": {
        const batch: string = args.batch, month: number = args.month, year: number = args.year;
        //let result = await this.db.get(sql.toString(), { $batch: batch, $month: month, $year: year });
        let result = await this.orm.manager.group.findOne({ batch, month, year });
        if (result?.batch === batch) return true;
        return false;
      }

      //async createGroup(year: number, month: number, batch: string, members: { UID: number, no_of_chits: number }[]): Promise<{ success: boolean; result: createGroupFields }>
      case "createGroup": {
        const year: number = args.year, month: number = args.month, batch: string = args.batch, members: { uuid: string, noOfChits: number }[] = args.members;
        let result: GroupD = null;
        let gName: string = `${year}-${month}-${batch}`;
        let total = 0;
        for (const member of members) {
          total += member.noOfChits;
        }
        if (total !== 20) {
          throw new Error("Total number of chits is not equal to 20");
        }

        //Creating group Object
        const group = new ChitORM.Group({ name: gName, batch, month, year, chits: [] });
        for (const member of members) {
          const user = await this.orm.manager.user.findOne({ uuid: member.uuid });
          const chit = new ChitORM.Chit({ user, group, noOfChits: member.noOfChits, payments: [] });
          for (let i = 1; i <= 20; i++) {
            chit.payments.push(new ChitORM.Payment({ chit, ispaid: false, imonth: i }));
          }
          group.chits.push(chit);
        }

        //Starting transaction
        this.orm.connection.manager.transaction(async manager => {
          result = await manager.save(group);
        });

        console.log(result);
        return result;
      }
      //async listUsers(): Promise<userInfo[]>
      case "listUsers": {
        return await this.orm.manager.user.find();
      }
      //async listGroups(): Promise<GroupInfo[]>
      case "listGroups": {
        let result: GroupD[];
        result = await this.orm.manager.group.find();
        return result;
      }
      //async userDetails(UID: number): Promise<userInfoExtended>
      case "userDetails": {
        const uuid: string = args.uuid;
        let userDetails = await this.orm.manager.user.findOne({ uuid });
        return userDetails;
      }
    }
  }
}