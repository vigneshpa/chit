import Group from "./Group";
import User from "./User";
import Model from "./Model";
import Payment from "./Payment";
export default class Chit extends Model {
    user: User;
    group: Group;
    noOfChits: number;
    payments: Payment[];
    constructor(base?: Partial<Chit>);
}
