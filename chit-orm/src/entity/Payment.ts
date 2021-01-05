import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Chit from "./Chit";
import Model from "./Model";
import User from "./User";

@Entity()
export default class Payment extends Model {

    @ManyToOne(type => Chit, Chit => Chit.payments)
    @JoinColumn()
    chit: Chit;

    @Column()
    imonth: number;

    @Column()
    ispaid: boolean;

    get toBePaid(): number {
        return this.chit.noOfChits * 5000;
    }

    get user(): User {
        return this.chit.user;
    }

}