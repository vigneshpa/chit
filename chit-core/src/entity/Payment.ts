import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Model from "./Model";

import Chit from "./Chit";
import User from "./User";

@Entity()
export default class Payment extends Model {

    @ManyToOne(type => Chit, Chit => Chit.payments)
    @JoinColumn()
    readonly chit: Chit;

    @Column()
    readonly imonth: RangeOf2<1, 20>;

    @Column()
    ispaid: boolean;

    get toBePaid(): number {
        return this.chit.noOfChits * 5000;
    }

    get user(): User {
        return this.chit.user;
    }

    constructor(base?: Partial<Payment>) {
        super();
        Object.assign(this, base);
    }

}