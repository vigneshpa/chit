import { Column, Entity, OneToMany } from "typeorm";
import Chit from "./Chit";
import Model from "./Model";

@Entity()
export default class Group extends Model {

  @Column({unique:true})
  readonly name: string;

  @Column({nullable:false})
  readonly batch: string;

  @Column("integer")
  readonly month: RangeOf2<1, 12>;

  @Column({nullable:false})
  readonly year: number;

  @OneToMany(type => Chit, Chit => Chit.group, { cascade: true })
  chits: Chit[];

  constructor(base?: Partial<Group>) {
    super();
    Object.assign(this, base);
  }
}