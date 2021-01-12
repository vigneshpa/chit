import "reflect-metadata";
import { Connection, createConnection, EntityManager, Repository } from "typeorm";
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
  static User: typeof User = User;
  static Group: typeof Group = Group;
  static Chit: typeof Chit = Chit;
  static Payment: typeof Payment = Payment;
  connection: Connection;
  manager: {
    user: Repository<User>;
    group: Repository<Group>;
    chit: Repository<Chit>;
    payment: Repository<Payment>;
  };


  constructor(options: { type: "postgres", url: string });
  constructor(options: { type: "sqlite", file: string });
  constructor(options: { type: "sqlite" | "postgres" }) {
    this.options = options;
  }
  public async connect() {
    this.connection = await createConnection({
      "type": this.options.type,
      "database": this.options.file,
      "synchronize": true,
      "logging": true,
      "entities": [User, Group, Chit, Payment],
    });
    this.manager = {
      user: this.connection.getRepository(User),
      chit: this.connection.getRepository(Chit),
      group: this.connection.getRepository(Group),
      payment: this.connection.getRepository(Payment)
    };
    return this.connection;
  }
  public async run(SQL: string, ...parms: any[]) {
    return await this.connection.manager.query(SQL, ...parms);
  }
}