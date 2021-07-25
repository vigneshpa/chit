import type { Client } from '../Entites';
import type Repos from '../Entites';

export default function makeFindClients(repos: Repos) {
  /**
   * Searches and Lists all the Clients
   * @param name Name of the client
   * @param phone Phone number of the client
   * @param address Address of the client
   */
  return async function findClients(params?: { partial: Partial<Client> }) {
    if (!(params && params.partial)) return Object.freeze(await repos.Client.find());

        // Validating
        if (params.partial.name && params.partial.name.length < 3) throw new Error('Name must be longer than 2 characters');
        if (params.partial.phone && params.partial.phone.length < 10) throw new Error('Phone number must be longer than 10 characters');
        if (params.partial.address && params.partial.address.length < 5) throw new Error('Address must be longer than 5 characters');

    // Searching for the clientrs
    const clients = await repos.Client.find({ where: params.partial });

    return Object.freeze(clients);
  };
}
