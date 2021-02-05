import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";
import Chit from "./Chit";
import Model from "./Model";

@Entity()
export default class Group extends Model {

  @Column({ unique: true })
  readonly name: string;

  @Column({ nullable: false })
  readonly batch: string;

  @Column("integer")
  readonly month: RangeOf2<1, 12>;

  @Column({ nullable: false })
  readonly year: number;

  @OneToMany(type => Chit, Chit => Chit.group, { cascade: true })
  readonly chits: Chit[];

  constructor(base?: Partial<Group>) {
    super();
    Object.assign(this, base);
  }
  @BeforeInsert()
  private validateGroup() {
    let totalChits = 0;
    this.chits.forEach(chit => {
      totalChits += chit.noOfChits;
      if (chit.payments.length !== 20) throw Error("No of Payments is not equal to 20");
    });
    if (totalChits !== 20) throw Error("No of chits in this group is not equal to 20");
  }
}