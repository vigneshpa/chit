import "reflect-metadata";
import { createConnection } from "typeorm";
import User from "./entity/User";
import Group from "./entity/Group";
import Chit from "./entity/Chit";
import Payment from "./entity/Payment";
export default class ChitORM {
    constructor(options) {
        this.options = options;
    }
    async connect() {
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
    async run(SQL, ...parms) {
        return await this.connection.manager.query(SQL, ...parms);
    }
}
ChitORM.User = User;
ChitORM.Group = Group;
ChitORM.Chit = Chit;
ChitORM.Payment = Payment;
