import { Column, Entity, OneToMany } from "typeorm";
import Chit from "./Chit";
import Model from "./Model";

@Entity()
export default class Group extends Model {

  @Column()
  name: string;

  @Column()
  batch: string;

  @Column()
  month: number;

  @Column()
  year: number;

  @OneToMany(type => Chit, Chit => Chit.group, { cascade: true })
  chits: Chit[];

  constructor(base?: Partial<Group>) {
    super();
    Object.assign(this, base);
  }
}