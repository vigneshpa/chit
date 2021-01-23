import { Column, Entity } from "typeorm";
import Model from "./Model";

@Entity()
export default class Winner extends Model{

    @Column()
    imonth:number;

    constructor(base?: Partial<Model>) {
        super();
        Object.assign(this, base);
    }
}