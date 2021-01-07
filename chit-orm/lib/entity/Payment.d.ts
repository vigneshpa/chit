import Chit from "./Chit";
import Model from "./Model";
import User from "./User";
export default class Payment extends Model {
    chit: Chit;
    imonth: number;
    ispaid: boolean;
    get toBePaid(): number;
    get user(): User;
    constructor(base?: Partial<Payment>);
}
