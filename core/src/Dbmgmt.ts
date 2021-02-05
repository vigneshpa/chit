import { Connection, ConnectionOptions, createConnection, Entity, Repository } from "typeorm";
import * as Entites from "./Entites";
import Entype from "./Entites";
const { User, Group, Chit, Payment, GroupTemplate, ChitTemplate } = Entites;
import { SqljsConnectionOptions } from "typeorm/driver/sqljs/SqljsConnectionOptions";
declare global {
    type DbmgmtOptions = {
        type: "postgres";
        url: string;
        ssl?: {
            rejectUnauthorized: false
        };
        schema: string;
        name: string;
    } | {
        type: "sqlite";
        database: string;
    } | SqljsConnectionOptions;
    type DbmgmtQueryArgs = { query: "checkPhone", phone: string, ret?: boolean }
        | { query: "createUser", name: string, phone: string, address?: string, ret?: UserD }
        | { query: "checkBatch", batch: string, month: RangeOf2<1, 12>, year: number, ret?: boolean }
        | { query: "createGroup", grouptUUID: string, ret?: GroupD }
        | { query: "createGroupTemplate", year: number, month: RangeOf2<1, 12>, batch: string, members: { uuid: string, noOfChits: number, paidInitial: boolean }[], ret?: Entites.GroupTemplate }
        | { query: "listGroups", ret?: GroupD[] }
        | { query: "listUsers", ret?: UserD[] }
        | { query: "userDetails", uuid: string, ret?: UserD }
        | { query: "groupDetails", uuid: string, ret?: GroupD };
    interface DbmgmtInterface {
        constructor: Function;
        connect: () => Promise<void>;
        close: () => Promise<void>;
        runQuery: (args: DbmgmtQueryArgs) => Promise<DbmgmtQueryArgs["ret"]>;
    }
}
type ORMRepos = {
    [etky in keyof Entype]: Repository<Entype[etky]>;
}
export default class Dbmgmt implements DbmgmtInterface {
    static readonly entities = Object.values(Entites);
    private options: ConnectionOptions;
    constructor(options: DbmgmtOptions) {
        this.options = {
            entities: Dbmgmt.entities,
            ...options,
            synchronize: true
        };
    }

    private connection?: Connection;
    private connected: boolean = false;
    async connect() {
        if (this.connected) throw new Error("Reusing old dbdmgmt object is illegal destory it");
        this.connection = await createConnection(this.options);
        this.repos = {
            User: this.connection.getRepository(User),
            Chit: this.connection.getRepository(Chit),
            Group: this.connection.getRepository(Group),
            Payment: this.connection.getRepository(Payment),
            GroupTemplate: this.connection.getRepository(GroupTemplate),
            ChitTemplate: this.connection.getRepository(ChitTemplate),
        }
        console.log(`Database connection opened for connection id ${this.connection.name}`);
        this.connected = true;
        this.runOnConnect.forEach(fn => fn());
    }
    async close() {
        if (this.connection?.isConnected) await this.connection.close();
        console.log("Database connection closed")
    }
    private repos?: ORMRepos;
    private runOnConnect: (() => void)[] = [];
    private delayedRunDquery(args: DbmgmtQueryArgs): ReturnType<Dbmgmt["runQuery"]> {
        if (this.connected) {
            return this.runQuery(args);
        } else
            return new Promise(resolve => this.runOnConnect.push(async () => {
                resolve(await this.runQuery(args));
            }));
    }
    public async runQuery(args: DbmgmtQueryArgs): Promise<DbmgmtQueryArgs["ret"]> {
        console.log("DBMGMT: Recived message to run query", args);
        if (!(this.repos?.Chit && this.connection && this.connected)) return await this.delayedRunDquery(args);
        switch (args.query) {

            case "checkPhone": {
                const phone = args.phone;
                let result = await this.repos.User.findOne({ phone })
                if (result?.phone === phone) return true;
                return false;
            }

            case "createUser": {
                const { name, phone, address } = args;
                let result: UserD = null;
                let user = new User({ name, phone, address });

                await this.connection.manager.transaction(async manager => {
                    await manager.save(user);
                });
                result = await this.repos.User.findOne({ phone })

                if (!result) throw new Error("Create User Does not exists in database");
                return result;
            }

            //async checkBatch(batch: string, month: number, year: number) 
            case "checkBatch": {
                const { batch, month, year } = args;
                let result = await this.repos.Group.findOne({ batch, month, year });
                if (result?.batch === batch) return true;
                return false;
            }

            //async createGroup(year: number, month: number, batch: string, members: { UID: number, no_of_chits: number }[]): Promise<{ success: boolean; result: createGroupFields }>
            case "createGroup": {
                const { grouptUUID } = args;
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
                return result;
            }
            //async listUsers(): Promise<userInfo[]>
            case "listUsers": {
                return await this.repos.User.find();
            }
            //async listGroups(): Promise<GroupInfo[]>
            case "listGroups": {
                let result: GroupD[];
                result = await this.repos.Group.find();
                return result;
            }
            //async userDetails(UID: number): Promise<userInfoExtended>
            case "userDetails": {
                const uuid = args.uuid;
                return await this.repos.User.findOne({ uuid });
            }

            case "groupDetails": {
                const uuid = args.uuid;
                return await this.repos.Group.findOne({ uuid });
            }

            case "createGroupTemplate": {
                const { year, month, batch, members } = args;
                let result: Entites.GroupTemplate = null;

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
        }
    }
}