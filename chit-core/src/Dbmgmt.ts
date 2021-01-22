import { Connection, ConnectionOptions, createConnection, Repository } from "typeorm";
import Payment from "./entity/Payment";
import Winner from "./entity/Winner";
import Group from "./entity/Group";
import Chit from "./entity/Chit";
import User from "./entity/User";
declare global {
    type DbmgmtOptions = {
        type: "postgres";
        url: string;
        ssl?: {
            rejectUnauthorized: false
        };
    } | {
        type: "sqlite";
        database: string;
    };
    type DbmgmtQueryArgs = { query: "checkPhone", phone: string, ret?: boolean }
        | { query: "createUser", name: string, phone: string, address?: string, ret?: UserD }
        | { query: "checkBatch", batch: string, month: number, year: number, ret?: boolean }
        | { query: "createGroup", year: number, month: number, batch: string, members: { uuid: string, noOfChits: number }[], ret?: GroupD }
        | { query: "listGroups", ret?: GroupD[] }
        | { query: "listUsers", ret?: UserD[] }
        | { query: "userDetails", uuid: string, ret?: UserD };
    interface DbmgmtInterface {
        constructor: Function;
        connect: () => Promise<void>;
        close: () => Promise<void>;
        runQuery: (args: DbmgmtQueryArgs) => Promise<DbmgmtQueryArgs["ret"]>;
    }
}
interface ORMRepos {
    user: Repository<User>;
    chit: Repository<Chit>;
    group: Repository<Group>;
    payment: Repository<Payment>;
    winner: Repository<Winner>;
    [entity: string]: Repository<any>;
}
export default class Dbmgmt implements DbmgmtInterface {
    static readonly entities = [User, Chit, Group, Payment, Winner];
    private options: ConnectionOptions;
    constructor(options: DbmgmtOptions) {
        this.options = {
            entities: Dbmgmt.entities,
            ...options,
            synchronize:true
        };
    }

    private connection?: Connection;
    async connect() {
        this.connection = await createConnection(this.options);
        this.repos = {
            user: this.connection.getRepository(User),
            chit: this.connection.getRepository(Chit),
            group: this.connection.getRepository(Group),
            payment: this.connection.getRepository(Payment),
            winner: this.connection.getRepository(Winner),
        }
        console.log("Database connection opened");
    }
    async close() {
        if (this.connection?.isConnected) await this.connection.close();
        console.log("Database connection closed")
    }
    private repos?: ORMRepos;
    public async runQuery(args: DbmgmtQueryArgs): Promise<DbmgmtQueryArgs["ret"]> {
        if (!(this.repos && this.connection)) throw new Error("Running a query before connecting is invalid");
        console.log("DBMGMT: Recived message to run query", args);
        switch (args.query) {

            case "checkPhone": {
                const phone = args.phone;
                let result = await this.repos.user.findOne({ phone })
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
                result = await this.repos.user.findOne({ phone })

                if (!result) throw new Error("Create User Does not exists in database");
                return result;
            }

            //async checkBatch(batch: string, month: number, year: number) 
            case "checkBatch": {
                const { batch, month, year } = args;
                let result = await this.repos.group.findOne({ batch, month, year });
                if (result?.batch === batch) return true;
                return false;
            }

            //async createGroup(year: number, month: number, batch: string, members: { UID: number, no_of_chits: number }[]): Promise<{ success: boolean; result: createGroupFields }>
            case "createGroup": {
                const { year, month, batch, members } = args;
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
                const group = new Group({ name: gName, batch, month, year, chits: [] });
                for (const member of members) {
                    const user = await this.repos.user.findOne({ uuid: member.uuid });
                    if (!user) throw new Error("Invalid member got from the renderer");
                    const chit = new Chit({ user, group, noOfChits: member.noOfChits, payments: [] });
                    for (let i = 1; i <= 20; i++) {
                        chit.payments.push(new Payment({ chit, ispaid: false, imonth: i as RangeOf2<1, 20> }));
                    }
                    group.chits.push(chit);
                }

                //Starting transaction
                await this.repos.group.manager.transaction(async manager => {
                    await manager.save(group);
                });

                result = await this.repos.group.findOne({ name: gName });
                if (!result) throw new Error("Created group does not exists in database.");
                return result;
            }
            //async listUsers(): Promise<userInfo[]>
            case "listUsers": {
                return await this.repos.user.find();
            }
            //async listGroups(): Promise<GroupInfo[]>
            case "listGroups": {
                let result: GroupD[];
                result = await this.repos.group.find();
                return result;
            }
            //async userDetails(UID: number): Promise<userInfoExtended>
            case "userDetails": {
                const uuid: string = args.uuid;
                let userDetails = await this.repos.user.findOne({ uuid });
                return userDetails;
            }
        }
    }
}