import "reflect-metadata";
import { Connection, createConnection, EntityManager, Repository } from "typeorm";
import User from "./entity/User";
import Group from "./entity/Group";
import Chit from "./entity/Chit";
import Payment from "./entity/Payment";
export interface ChitORMOptions {
  type: "sqlite" | "postgres";
  url?:string;
  file?:string;
}
export default class ChitORM {
  options: ChitORMOptions;
  User: typeof User;
  Group: typeof Group;
  Chit: typeof Chit;
  Payment:typeof Payment;
  connection:Connection;
  manager:{
    user:Repository<User>;
    group:Repository<Group>;
    chit:Repository<Chit>;
    payment:Repository<Payment>;
  };


  constructor(options:{type:"postgres", url:string});
  constructor(options:{type:"sqlite", file:string});
  constructor(options:{type:"sqlite"|"postgres"}) {
    this.User = User;
    this.Group = Group;
    this.Chit = Chit;
    this.options = options;
  }
  public async connect() {
    this.connection = await createConnection({
      "type": this.options.type,
      "database": this.options.file,
      "synchronize": true,
      "logging": true,
      "entities": [this.User, this.Group, this.Chit, this.Payment],
    });
    this.manager.user = this.connection.getRepository(User);
    this.manager.chit = this.connection.getRepository(Chit);
    this.manager.group = this.connection.getRepository(Group);
    this.manager.payment = this.connection.getRepository(Payment);
    return this.connection;
  }
  public async run(SQL:string, ...parms:any[]){
    return await this.connection.manager.query(SQL, ...parms);
  }
}