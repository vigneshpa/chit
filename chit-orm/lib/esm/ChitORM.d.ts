import "reflect-metadata";
import { Connection, Repository } from "typeorm";
import User from "./entity/User";
import Group from "./entity/Group";
import Chit from "./entity/Chit";
export interface ChitORMOptions {
    type: "sqlite" | "postgres";
    url?: string;
    file?: string;
}
export default class ChitORM {
    options: ChitORMOptions;
    User: typeof User;
    Group: typeof Group;
    Chit: typeof Chit;
    connection: Connection;
    manager: {
        user: Repository<User>;
        group: Repository<Group>;
        chit: Repository<Chit>;
    };
    constructor(options: {
        type: "postgres";
        url: string;
    });
    constructor(options: {
        type: "sqlite";
        file: string;
    });
    connect(): Promise<Connection>;
    run(SQL: string, ...parms: any[]): Promise<any>;
}
