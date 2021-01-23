<<<<<<< HEAD
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
=======
import { Column, Entity, OneToMany } from "typeorm";
>>>>>>> c50ec8ebd496835339570cd24c507ca9592528a9
import Chit from "./Chit";
import Model from "./Model";

@Entity()
export default class Group extends Model {

  @Column()
  readonly name: string;

  @Column()
  readonly batch: string;

  @Column()
  readonly month: number;

  @Column()
  readonly year: number;

  @OneToMany(type => Chit, Chit => Chit.group, { cascade: true })
  chits: Chit[];

  @Column("json")
  winners:{[imonth:number]:string[]};

  constructor(base?: Partial<Group>) {
    super();
    Object.assign(this, base);
  }

  @BeforeInsert()
  private beforeInsert(){
    this.winners = {};
    for(let i = 1; i<=20; i++){
      this.winners[i] = [];
    }
  }
}