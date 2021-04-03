import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column, BeforeInsert } from "typeorm";
import GroupTemplate from "./GroupTemplate";
import { v4 as uuid } from "uuid";
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

  @Column({ type: 'uuid', unique: true })
  readonly uuid: string;

  @BeforeInsert()
  private createUuid() {
    (this.uuid as GroupTemplate["uuid"]) = uuid();
  }

  constructor(base?: Partial<ChitTemplate>) {
    Object.assign(this, base);
  }
}