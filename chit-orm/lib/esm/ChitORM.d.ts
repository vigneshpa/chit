import "reflect-metadata";
import { Connection, Repository } from "typeorm";
import User from "./entity/User";
import Group from "./entity/Group";
import Chit from "./entity/Chit";
import Payment from "./entity/Payment";
export interface ChitORMOptions {
    type: "sqlite" | "postgres";
    url?: string;
    file?: string;
}
export default class ChitORM {
    options: ChitORMOptions;
    static User: typeof User;
    static Group: typeof Group;
    static Chit: typeof Chit;
    static Payment: typeof Payment;
    connection: Connection;
    manager: {
        user: Repository<User>;
        group: Repository<Group>;
        chit: Repository<Chit>;
        payment: Repository<Payment>;
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
