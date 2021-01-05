import Group from "./Group";
import User from "./User";
import Model from "./Model";
export default class Chit extends Model {
    user: User;
    group: Group;
    noOfChits: number;
    constructor(base?: Partial<Chit>);
}
