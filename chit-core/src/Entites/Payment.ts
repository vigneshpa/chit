import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { Chit, User } from "../Entites";
import Model from "./Model";

@Entity()
export default class Payment extends Model {

  @ManyToOne(type => Chit, Chit => Chit.payments)
  @JoinColumn()
  readonly chit: Chit;

  @Column("integer", { nullable: false })
  readonly imonth: RangeOf2<1, 20>;

  @Column({ nullable: false })
  ispaid: boolean;

  get toBePaid(): number {
    const base = 5000;
    const intrest = 1000;

    let toBePaidPerChit = base;
    if (this.chit.wonAtMonth) {
      if (this.chit.wonAtMonth < this.imonth) toBePaidPerChit += intrest;
    }
    return this.chit.noOfChits * toBePaidPerChit;
  }

  get user(): User {
    return this.chit.user;
  }

  constructor(base?: Partial<Payment>) {
    super();
    Object.assign(this, base);
  }

}