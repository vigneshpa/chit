import { Column, Entity } from "typeorm";
import Model from "./Model";

@Entity()
export default class Winner extends Model{

    @Column("number")
    imonth:RangeOf2<1, 20>;

    constructor(base?: Partial<Model>) {
        super();
        Object.assign(this, base);
    }
}