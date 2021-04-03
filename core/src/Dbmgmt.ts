import { Connection, ConnectionOptions, createConnection, Repository } from "typeorm";
import * as Entites from "./Entites";
import Entype from "./Entites";
import { SqljsConnectionOptions } from "typeorm/driver/sqljs/SqljsConnectionOptions";
import Actions from "./Actions";
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
    interface DbmgmtInterface {
        constructor: Function;
        connect: () => Promise<void>;
        close: () => Promise<void>;
        runQuery: (args: DbmgmtQueryArgs) => Promise<DbmgmtQueryArgs["ret"]>;
    }
    type ORMRepos = {
        [etky in keyof Entype]: Repository<Entype[etky]>;
    }
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
    private actions:Actions;
    async connect() {
        if (this.connected) throw new Error("Reusing old dbdmgmt object is illegal destory it");
        this.connection = await createConnection(this.options);
        const repos:ORMRepos = <ORMRepos>{};
        let key : keyof typeof Entites;
        for (key in Entites) {
            if (Object.prototype.hasOwnProperty.call(Entites, key)) {
                repos[key] = <any>this.connection.getRepository(Entites[key])
            }
        }
        this.repos = repos;
        console.log(`Database connection opened for connection id ${this.connection.name}`);
        this.connected = true;

        this.actions = new Actions(this.repos, this.connection);

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
        return this.actions[args.query](<any>args);
    }
}