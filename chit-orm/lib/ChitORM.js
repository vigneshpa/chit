"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Group_1 = require("./entity/Group");
const Chit_1 = require("./entity/Chit");
const Payment_1 = require("./entity/Payment");
class ChitORM {
    constructor(options) {
        this.options = options;
    }
    async connect() {
        this.connection = await typeorm_1.createConnection({
            "type": this.options.type,
            "database": this.options.file,
            "synchronize": true,
            "logging": true,
            "entities": [User_1.default, Group_1.default, Chit_1.default, Payment_1.default],
        });
        this.manager = {
            user: this.connection.getRepository(User_1.default),
            chit: this.connection.getRepository(Chit_1.default),
            group: this.connection.getRepository(Group_1.default),
            payment: this.connection.getRepository(Payment_1.default)
        };
        return this.connection;
    }
    async run(SQL, ...parms) {
        return await this.connection.manager.query(SQL, ...parms);
    }
}
exports.default = ChitORM;
ChitORM.User = User_1.default;
ChitORM.Group = Group_1.default;
ChitORM.Chit = Chit_1.default;
ChitORM.Payment = Payment_1.default;
