"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Group_1 = require("./entity/Group");
const Chit_1 = require("./entity/Chit");
class ChitORM {
    constructor(options) {
        this.User = User_1.default;
        this.Group = Group_1.default;
        this.Chit = Chit_1.default;
        this.options = options;
    }
    async connect() {
        this.connection = await typeorm_1.createConnection({
            "type": this.options.type,
            "database": this.options.file,
            "synchronize": true,
            "logging": true,
            "entities": [this.User, this.Group, this.Chit],
        });
        this.manager.user = this.connection.getRepository(User_1.default);
        this.manager.chit = this.connection.getRepository(Chit_1.default);
        this.manager.group = this.connection.getRepository(Group_1.default);
        return this.connection;
    }
    async run(SQL, ...parms) {
        return await this.connection.manager.query(SQL, ...parms);
    }
}
exports.default = ChitORM;
