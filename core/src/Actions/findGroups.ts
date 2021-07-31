import { isFiniteUnSignInteger } from '../utils';
import type { RangeOf2 } from '../vendorTypes';
import type { Group } from '../Entites';
import type Repos from '../Entites';

export default function makeFindGroups(repos: Repos) {
  return async function findGroups(params: { partial: Partial<Group> }) {
    if (!(params && params.partial)) return Object.freeze(await repos.Group.find());

    // Validating
    if (params.partial.year && !isFiniteUnSignInteger(params.partial.year)) throw new Error('Year is not valid');
    if (params.partial.month && !isFiniteUnSignInteger(params.partial.month)) throw new Error('Month is not valid');
    if (params.partial.batch && params.partial.batch.length > 3) throw new Error('Batch cannot be longer than 3');
    if (params.partial.totalValue && !isFiniteUnSignInteger(params.partial.totalValue)) throw new Error('Specified total value is not valid');

    // Searching for groups
    let groups = await repos.Group.find({ where: params.partial });

    return Object.freeze(groups);
  };
}
