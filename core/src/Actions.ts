import { Connection } from "typeorm";
import * as Entites from "./Entites";

declare global {
  type DbmgmtQueryArgs = { query: "checkPhone", phone: string, ret?: boolean }
    | { query: "createUser", name: string, phone: string, address?: string, ret?: UserD }
    | { query: "checkBatch", batch: string, month: RangeOf2<1, 12>, year: number, ret?: boolean }
    | { query: "createGroup", grouptUUID: string, ret?: GroupD }
    | { query: "createGroupTemplate", year: number, month: RangeOf2<1, 12>, batch: string, members: { uuid: string, noOfChits: number, paidInitial: boolean }[], ret?: Entites.GroupTemplate }
    | { query: "listGroups", ret?: GroupD[] }
    | { query: "listUsers", ret?: UserD[] }
    | { query: "listGroupTemplates", ret?:GroupTD[] }
    | { query: "userDetails", uuid: string, ret?: UserD }
    | { query: "groupDetails", uuid: string, ret?: GroupD }
    | { query: "groupTemplateDetails", uuid:string, ret?:GroupTD};
}



const { User, Group, Chit, Payment, GroupTemplate, ChitTemplate } = Entites;


export default class Actions {

  private repos: ORMRepos;

  private connection: Connection;

  constructor(reposA: ORMRepos, connectionA: Connection) {
    this.repos = reposA;
    this.connection = connectionA
  };

  async checkPhone(args: { phone: string }): Promise<boolean> {
    let result = await this.repos.User.findOne({ phone: args.phone })
    if (result?.phone === args.phone) return true;
    return false;
  }

  async createUser(args: { name: string, phone: string, address: string }): Promise<UserD> {
    let result: UserD = null;
    const { name, phone, address } = args;
    let user = new User({ name, phone, address });

    await this.connection.manager.transaction(async manager => {
      await manager.save(user);
    });
    result = await this.repos.User.findOne({ phone })

    if (!result) throw new Error("Created User Does not exists in database");
    return result;
  }

  async checkBatch(args: { batch: string, month: RangeOf2<1, 12>, year: number }): Promise<boolean> {
    const { batch, month, year } = args;
    let result = await this.repos.Group.findOne({ batch, month, year });
    if (result?.batch === batch) return true;
    return false;
  }

  async createGroup(args: { grouptUUID: string }) {
    const grouptUUID = args.grouptUUID;
    const groupt = await this.repos.GroupTemplate.findOne({ uuid: grouptUUID }, { relations: ["ChitTemplate", "User"] });
    if (groupt) throw new Error("Invalid group");
    const { year, month, batch } = groupt;
    const gName: string = `${year}-${month}-${batch}`;
    let total = 0;
    for (const chit of groupt.chits) {
      total += chit.noOfChits;
    }
    if (total !== 20) {
      throw new Error("Total number of chits is not equal to 20");
    }

    //Creating group Object
    const group = new Group({ name: gName, batch, month, year, chits: [] });
    for (const chitt of groupt.chits) {
      const user = chitt.user;
      if (!user) throw new Error("Invalid member got from the template");
      const chit = new Chit({ user, group, noOfChits: chitt.noOfChits, payments: [] });
      for (let i = 1; i <= 20; i++) {
        chit.payments.push(new Payment({ chit, ispaid: (chitt.paidInitial && i === 1), imonth: i as RangeOf2<1, 20> }));
      }
      group.chits.push(chit);
    }

    //Starting transaction
    await this.repos.Group.manager.transaction(async manager => {
      await manager.save(group);
    });

    const result = await this.repos.Group.findOne({ name: gName });
    if (!result) throw new Error("Created group does not exists in database.");
    await this.repos.GroupTemplate.remove(groupt);
    return result;
  }

  async listUsers(): Promise<UserD[]> {
    return await this.repos.User.find();
  }

  async listGroups(): Promise<GroupD[]> {
    return await this.repos.Group.find();
  }

  async listGroupTemplates(): Promise<GroupTD[]> {
    return await this.repos.GroupTemplate.find();
  }

  async userDetails(args: { uuid: string }): Promise<UserD> {
    return await this.repos.User.findOneOrFail({ uuid: args.uuid });
  }

  async groupDetails(args: { uuid: string }) {
    return await this.repos.Group.findOneOrFail({ uuid: args.uuid });
  }

  async createGroupTemplate(args: { year: number, month: RangeOf2<1, 12>, batch: string, members: { uuid: string, noOfChits: number, paidInitial: boolean }[] }): Promise<Entites.GroupTemplate> {
    let result: Entites.GroupTemplate = null;
    const { year, month, batch, members } = args;

    //Creating group Object
    const groupt = new GroupTemplate({ batch, month, year, chits: [] });
    for (const member of members) {
      const user = await this.repos.User.findOne({ uuid: member.uuid });
      if (!user) throw new Error("Invalid member got for creation of Group Template");
      const chit = new ChitTemplate({ user, groupt, noOfChits: member.noOfChits, month, year, paidInitial: member.paidInitial });
      groupt.chits.push(chit);
    }

    //Starting transaction
    await this.repos.GroupTemplate.manager.transaction(async manager => {
      await manager.save(groupt);
    });

    result = await this.repos.GroupTemplate.findOne({ batch, month, year });
    if (!result) throw new Error("Created group does not exists in database.");
    return result;
  }
  async groupTemplateDetails(uuid:string): Promise<GroupTD>{
    return this.repos.GroupTemplate.findOneOrFail({uuid});
  }
}