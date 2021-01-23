import { Entity, Column, OneToMany } from "typeorm";
import Model from "./Model";

import Chit from "./Chit";

@Entity()
export default class User extends Model {

    @Column()
    name: string;

    @Column()
    readonly phone: string;

    @Column()
    address: string;

    @OneToMany(type => Chit, Chit => Chit.user)
    readonly chits: Chit[];

    constructor(base?: Partial<User>) {
        super();
        Object.assign(this, base);
    }
}
