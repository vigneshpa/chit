import Chit from "./Chit";
import Model from "./Model";
export default class Group extends Model {
    name: string;
    batch: string;
    month: number;
    year: number;
    chits: Chit[];
    constructor(base?: Partial<Group>);
}
