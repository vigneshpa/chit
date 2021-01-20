import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, Unique } from "typeorm";
import { v4 as uuid } from "uuid";

interface internalModel {
    uuid: string;
}
export default abstract class Model {
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

    toJSON() {
        return { ...this, id: undefined }
    }
}