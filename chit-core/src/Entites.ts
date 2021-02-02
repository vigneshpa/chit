/**
 * This is a giant module with all entites to prevent circular depedency errors.
 */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { v4 as uuid } from "uuid";





/**
 * Modal Entity
 */

interface internalModel {
  uuid: string;
}
abstract class Model {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ type: 'uuid', unique: true })
  readonly uuid: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @BeforeInsert()
  private createUuid() {
    (this.uuid as Model["uuid"]) = uuid();
  }

  toJSON(): string {
    return { ...this, id: undefined }
  }
}





/**
 * User Entity
 */

@Entity()
class User extends Model {

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





/**
 * Group Entity
 */

@Entity()
class Group extends Model {

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





/**
 * Chit Entity
 */

@Entity()
class Chit extends Model {

  @JoinColumn()
  @ManyToOne(type => User, User => User.chits)
  readonly user: User;

  @JoinColumn()
  @ManyToOne(type => Group, Group => Group.chits)
  readonly group: Group;
  /* 
    @Column("integer", {nullable:false})
    readonly month: RangeOf2<1, 12>;
  
    @Column({nullable:false})
    readonly year: number; */

  @Column({ nullable: false })
  readonly noOfChits: number;

  @OneToMany(type => Payment, Payment => Payment.chit, { cascade: true })
  readonly payments: Payment[];

  @Column({ type: "integer", nullable: true })
  wonAtMonth: RangeOf2<1, 20> | null;

  constructor(base?: Partial<Chit>) {
    super();
    Object.assign(this, base);
  }
}





/**
 * Payment Entity
 */

@Entity()
class Payment extends Model {

  @ManyToOne(type => Chit, Chit => Chit.payments)
  @JoinColumn()
  readonly chit: Chit;

  @Column("integer", { nullable: false })
  readonly imonth: RangeOf2<1, 20>;

  @Column({ nullable: false })
  ispaid: boolean;

  get toBePaid(): number {
    const base = 5000;
    const intrest = 1000;

    let toBePaidPerChit = base;
    if (this.chit.wonAtMonth) {
      if (this.chit.wonAtMonth < this.imonth) toBePaidPerChit += intrest;
    }
    return this.chit.noOfChits * toBePaidPerChit;
  }

  get user(): User {
    return this.chit.user;
  }

  constructor(base?: Partial<Payment>) {
    super();
    Object.assign(this, base);
  }

}




/**
 * GroupTemplate Entity
 */

@Entity()
class GroupTemplate {

  @PrimaryGeneratedColumn()
  id: number;

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





/**
 * ChitTemplate entity
 */

@Entity()
class ChitTemplate {

  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(type => User)
  readonly user: User;

  @JoinColumn()
  @ManyToOne(type => GroupTemplate, GroupTemplate => GroupTemplate.chits)
  groupt: GroupTemplate;

  @Column("integer", { nullable: false })
  month: RangeOf2<1, 12>;

  @Column({ nullable: false })
  year: number;

  @Column()
  paidInitial: boolean;

  @Column({ nullable: false })
  readonly noOfChits: number;

  constructor(base?: Partial<ChitTemplate>) {
    Object.assign(this, base);
  }
}

export { Payment, Group, Chit, User, GroupTemplate, ChitTemplate };