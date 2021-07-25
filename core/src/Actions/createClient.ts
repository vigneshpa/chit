import { Client } from '../Entites';
import type Repos from '../Entites';

export default function makeCreateClient(repos: Repos) {
  /**
   * Creates a new Client
   * @param name Name of the client
   * @param phone Phone number of the client
   * @param address Address of the client
   */
  return async function createClient({ name, phone, address }: { name: string; phone: string; address: string }) {
    // Validating
    if (name.length < 3) throw new Error('Name must be longer than 2 characters');
    if (phone.length < 10) throw new Error('Phone number must be longer than 10 characters');
    if (address.length < 5) throw new Error('Address must be longer than 5 characters');

    // Checking existance of the client
    let count = await repos.Client.count({ phone });
    if (count > 0) throw new Error('Client with same phone number already exists');

    // Creating Client object
    let client = new Client();

    // Assigning properties
    client.name = name;
    client.phone = phone;
    client.address = address;
    client.chits = [];

    // Saving client
    client = await repos.Client.save(client);

    return Object.freeze(client);
  };
}
