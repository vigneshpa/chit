import Payment from './Payment';
import Chit from './Chit';
import Group from './Group';
import User from './User';
import type { Repository } from 'typeorm';
export { User, Group, Chit, Payment };
export default interface Repos {
  User: Repository<User>;
  Group: Repository<Group>;
  Chit: Repository<Chit>;
  Payment: Repository<Payment>;
}
