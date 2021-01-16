import { Column, Entity } from "typeorm";
import { RangeOf2 } from "../vendorTypes";
import Model from "./Model";

@Entity()
export default class extends Model{

    @Column("number")
    imonth:RangeOf2<1, 20>;

    constructor(base?: Partial<Model>) {
        super();
        Object.assign(this, base);
    }
}