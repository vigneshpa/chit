import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm';
import Chit from './Chit';
import Model from './Model';
import type { RangeOf2 } from '../vendorTypes';

@Entity()
export default class Group extends Model {
  @Column({ unique: true })
  name!: string;

  @Column({ nullable: false })
  batch!: string;

  @Column('integer')
  month!: RangeOf2<1, 12>;

  @Column({ nullable: false })
  year!: number;

  @Column({ nullable: false, type: 'integer' })
  totalValue!: number;

  @Column({ nullable: false })
  isActive: boolean = false;

  @OneToMany(type => Chit, Chit => Chit.group, { cascade: true })
  chits: Chit[] = [];

  /**
   * This method tests all the chits and activates
   * the group if conditions are satisfied
   *
   * Warning: Once activated it cannot be modified
   */
  activate() {
    // Vaidating totsum of all chits value
    if (this.isActive) throw new Error('Group is already active');
    let chitsTotalValue = 0;
    this.chits.forEach(chit => {
      chitsTotalValue += chit.value;
    });
    if (chitsTotalValue < this.totalValue) throw new Error('Chits are not sufficient');
    if (chitsTotalValue > this.totalValue) throw new Error('Chits are more than the limit');
    (this.isActive as boolean) = true;
  }
}
