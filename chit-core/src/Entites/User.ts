import { Entity, Column, OneToMany } from "typeorm";
import Chit from "./Chit";
import Model from "./Model";

@Entity()
export default class User extends Model {

  @Column()
  name: string;

  @Column()
  readonly phone: string;

  @Column()
  address: string;

  @OneToMany(type => Chit, Chit => Chit.user)
  readonly chits: Chit[];

  constructor(base?: Partial<User>) {
    super();
    Object.assign(this, base);
  }
}