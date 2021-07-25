import Payment from './Payment';
import Chit from './Chit';
import Group from './Group';
import Client from './Client';
import type { Repository } from 'typeorm';
export { Client, Group, Chit, Payment };
export default interface Repos {
  Client: Repository<Client>;
  Group: Repository<Group>;
  Chit: Repository<Chit>;
  Payment: Repository<Payment>;
}
