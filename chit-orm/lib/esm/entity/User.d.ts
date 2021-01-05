import Chit from "./Chit";
import Model from "./Model";
export default class User extends Model {
    name: string;
    phone: string;
    address: string;
    chits: Chit[];
    constructor(base?: Partial<User>);
}
