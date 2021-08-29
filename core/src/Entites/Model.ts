import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { v4 } from 'uuid';

export default abstract class Model {
  @PrimaryGeneratedColumn()
  private id!: number;

  @Column({ type: 'uuid', unique: true })
  readonly uuid: string;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  constructor(uuid?: string) {
    this.uuid = uuid || v4();
  }
}
