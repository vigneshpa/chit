import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Group from "./Group";
import User from "./User";
import Model from "./Model";
import Payment from "./Payment";
@Entity()
export default class Chit extends Model {

  @JoinColumn()
  @ManyToOne(type => User, User => User.chits)
  readonly user: User;

  @JoinColumn()
  @ManyToOne(type => Group, Group => Group.chits)
  group: Group;

  @Column("integer", {nullable:false})
  readonly month: RangeOf2<1, 12>;

  @Column({nullable:false})
  readonly year: number;

  @Column({ nullable: false })
  noOfChits: number;

  @OneToMany(type => Payment, Payment => Payment.chit, { cascade: true })
  readonly payments: Payment[];

  @Column({ type: "integer", nullable: true })
  wonAtMonth: RangeOf2<1, 20> | null;

  constructor(base?: Partial<Chit>) {
    super();
    Object.assign(this, base);
  }
}