import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import ChitTemplate from "./ChitTemplate";
import { v4 as uuid } from "uuid";

@Entity()
export default class GroupTemplate {

  @PrimaryGeneratedColumn()
  id:number;

  @Column({ nullable: false })
  batch: string;

  @Column("integer", { nullable: false })
  month: RangeOf2<1, 12>;

  @Column({ nullable: false })
  year: number;

  @OneToMany(type => ChitTemplate, ChitTemplate => ChitTemplate.groupt, { cascade: true })
  chits: ChitTemplate[];

  @Column({ type: 'uuid', unique: true })
  readonly uuid: string;

  @BeforeInsert()
  private createUuid() {
    (this.uuid as GroupTemplate["uuid"]) = uuid();
  }

  constructor(base?: Partial<GroupTemplate>) {
    Object.assign(this, base);
  }

  get name() {
    return this.year + this.month + this.batch;
  }
}