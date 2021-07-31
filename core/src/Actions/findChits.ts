import { isFiniteUnSignInteger } from '../utils';
import type Repos from '../Entites';

export default function makeFindChits(repos: Repos) {
  return async function findChits({ clientUuid, groupUuid, value }: { clientUuid?: string; groupUuid?: string; value?: number }) {
    // getting client object
    const client = clientUuid ? await repos.Client.findOne({ uuid: clientUuid }) : undefined;

    // getting group object
    const group = groupUuid ? await repos.Group.findOne({ uuid: groupUuid }) : undefined;

    // Validating value
    if (value && !isFiniteUnSignInteger(value)) throw new Error('Value of an chit is not valid');

    const chits = repos.Chit.find({ client, group, value });

    return Object.freeze(chits);
  };
}
