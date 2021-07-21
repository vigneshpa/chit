import type Repos from '../Entites';

export default function makeFindUsers(repos: Repos) {
  /**
   * Searches and Lists all the Users
   * @param name Name of the user
   * @param phone Phone number of the user
   * @param address Address of the user
   */
  return async function findUsers({ name, phone, address }: { name?: string; phone?: string; address?: string }) {
    // Validating
    if (name && name.length < 3) throw new Error('Name must be longer than 2 characters');
    if (phone && phone.length < 10) throw new Error('Phone number must be longer than 10 characters');
    if (address && address.length < 5) throw new Error('Address must be longer than 5 characters');

    // Searching for the userrs
    const users = await repos.User.find({ name, phone, address });

    return Object.freeze(users);
  };
}
