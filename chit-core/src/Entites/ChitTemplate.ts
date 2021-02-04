import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from "typeorm";
import GroupTemplate from "./GroupTemplate";
import User from "./User";

@Entity()
export default class ChitTemplate {

  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(type => User)
  readonly user: User;

  @JoinColumn()
  @ManyToOne(type => GroupTemplate, GroupTemplate => GroupTemplate.chits)
  groupt: GroupTemplate;

  @Column("integer", { nullable: false })
  month: RangeOf2<1, 12>;

  @Column({ nullable: false })
  year: number;

  @Column()
  paidInitial: boolean;

  @Column({ nullable: false })
  readonly noOfChits: number;

  constructor(base?: Partial<ChitTemplate>) {
    Object.assign(this, base);
  }
}