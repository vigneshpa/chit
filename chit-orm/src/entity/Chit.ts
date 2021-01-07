import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Group from "./Group";
import User from "./User";
import Model from "./Model";
import Payment from "./Payment";
@Entity()
export default class Chit extends Model {

  @ManyToOne(type => User, User => User.chits)
  @JoinColumn()
  user: User;

  @ManyToOne(type => Group, Group => Group.chits)
  group: Group;

  @Column()
  noOfChits: number;

  @OneToMany(type => Payment, Payment => Payment.chit, {cascade:true})
  payments: Payment[];

  constructor(base?: Partial<Chit>) {
    super();
    Object.assign(this, base);
  }
}