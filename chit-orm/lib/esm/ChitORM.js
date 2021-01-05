import "reflect-metadata";
import { createConnection } from "typeorm";
import User from "./entity/User";
import Group from "./entity/Group";
import Chit from "./entity/Chit";
export default class ChitORM {
    constructor(options) {
        this.User = User;
        this.Group = Group;
        this.Chit = Chit;
        this.options = options;
    }
    async connect() {
        this.connection = await createConnection({
            "type": this.options.type,
            "database": this.options.file,
            "synchronize": true,
            "logging": true,
            "entities": [this.User, this.Group, this.Chit],
        });
        this.manager.user = this.connection.getRepository(User);
        this.manager.chit = this.connection.getRepository(Chit);
        this.manager.group = this.connection.getRepository(Group);
        return this.connection;
    }
    async run(SQL, ...parms) {
        return await this.connection.manager.query(SQL, ...parms);
    }
}
