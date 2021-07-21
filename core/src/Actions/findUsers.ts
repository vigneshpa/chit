import type { User } from '../Entites';
import type Repos from '../Entites';

export default function makeFindUsers(repos: Repos) {
  /**
   * Searches and Lists all the Users
   * @param name Name of the user
   * @param phone Phone number of the user
   * @param address Address of the user
   */
  return async function findUsers(params?: { partial: Partial<User> }) {
    if (!(params && params.partial)) return Object.freeze(await repos.User.find());

        // Validating
        if (params.partial.name && params.partial.name.length < 3) throw new Error('Name must be longer than 2 characters');
        if (params.partial.phone && params.partial.phone.length < 10) throw new Error('Phone number must be longer than 10 characters');
        if (params.partial.address && params.partial.address.length < 5) throw new Error('Address must be longer than 5 characters');

    // Searching for the userrs
    const users = await repos.User.find({ where: params.partial });

    return Object.freeze(users);
  };
}