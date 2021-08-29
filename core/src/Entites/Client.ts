import { Entity, Column, OneToMany } from 'typeorm';
import Chit from './Chit';
import Model from './Model';

@Entity('clients')
export default class Client extends Model {
  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  address!: string;

  @OneToMany(type => Chit, Chit => Chit.client)
  chits!: Chit[];
}
