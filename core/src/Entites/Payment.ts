import type { RangeOf2 } from '../vendorTypes';
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import Chit from './Chit';
import Model from './Model';

@Entity()
export default class Payment extends Model {
  @JoinColumn()
  @ManyToOne(type => Chit, Chit => Chit.payments)
  chit!: Chit;

  @Column('integer', { nullable: false })
  imonth!: RangeOf2<1, 20>;

  @Column({ nullable: false })
  ispaid!: boolean;

  get toBePaid(): number {
    let base = this.chit.value / 20;
    const intrest = base / 5;

    // Adding interest if the chit is won before this payment
    if (this.chit.wonAtMonth && this.chit.wonAtMonth < this.imonth) base += intrest;
    return base;
  }
}
