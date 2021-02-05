import { Entity, JoinColumn, ManyToOne, Column, OneToMany } from "typeorm";
import Payment from "./Payment";
import Group from "./Group";
import User from "./User";
import Model from "./Model";

@Entity()
export default class Chit extends Model {

  @JoinColumn()
  @ManyToOne(type => User, User => User.chits)
  readonly user: User;

  @JoinColumn()
  @ManyToOne(type => Group, Group => Group.chits)
  readonly group: Group;

  @Column({ nullable: false })
  readonly noOfChits: number;

  @OneToMany(type => Payment, Payment => Payment.chit, { cascade: true })
  readonly payments: Payment[];

  @Column({ type: "integer", nullable: true })
  wonAtMonth: RangeOf2<1, 20> | null;

  constructor(base?: Partial<Chit>) {
    super();
    Object.assign(this, base);
  }
}