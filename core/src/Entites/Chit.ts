import { Entity, JoinColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import Payment from './Payment';
import Group from './Group';
import User from './User';
import Model from './Model';
import type { RangeOf2 } from '../vendorTypes';

@Entity()
export default class Chit extends Model {
  @JoinColumn()
  @ManyToOne(type => User, User => User.chits)
  user!: User;

  @JoinColumn()
  @ManyToOne(type => Group, Group => Group.chits)
  group!: Group;

  @Column({ nullable: false, type: 'integer' })
  value!: number;

  @OneToMany(type => Payment, Payment => Payment.chit, { cascade: true })
  payments!: Payment[];

  @Column({ type: 'integer', nullable: true })
  wonAtMonth: RangeOf2<1, 20> | null = null;
}
