import { User } from '../Entites';
import type Repos from '../Entites';

export default function makeCreateUser(repos: Repos) {
  /**
   * Creates a new User
   * @param name Name of the user
   * @param phone Phone number of the user
   * @param address Address of the user
   */
  return async function createUser({ name, phone, address }: { name: string; phone: string; address: string }) {
    // Validating
    if (name.length < 3) throw new Error('Name must be longer than 2 characters');
    if (phone.length < 10) throw new Error('Phone number must be longer than 10 characters');
    if (address.length < 5) throw new Error('Address must be longer than 5 characters');

    // Checking existance of the user
    let count = await repos.User.count({ phone });
    if (count > 0) throw new Error('User with same phone number already exists');

    // Creating User object
    let user = new User();

    // Assigning properties
    user.name = name;
    user.phone = phone;
    user.address = address;
    user.chits = [];

    // Saving user
    user = await repos.User.save(user);

    return Object.freeze(user);
  };
}
