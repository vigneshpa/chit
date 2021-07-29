import { isFiniteUnSignInteger } from '../utils';
import type { RangeOf2 } from '../vendorTypes';
import type { Group } from '../Entites';
import type Repos from '../Entites';
import { Z_PARTIAL_FLUSH } from 'zlib';

export default function makeFindGroups(repos: Repos) {
  /**
   * Finds all the groups whith params
   * @param year Year in number
   * @param month Month of the year
   * @param batch Batch of the month
   * @param totalValue Total value of the batch
   */
  return async function findGroups(params: { partial: Partial<Group> }) {
    if (!(params && params.partial)) return Object.freeze(await repos.Group.find());

    // Validating
    if (params.partial.year && !isFiniteUnSignInteger(params.partial.year)) throw new Error('Year is not valid');
    if (params.partial.month && !isFiniteUnSignInteger(params.partial.month)) throw new Error('Month is not valid');
    if (params.partial.batch && params.partial.batch.length > 3) throw new Error('Batch cannot be longer than 3');
    if (params.partial.totalValue && !isFiniteUnSignInteger(params.partial.totalValue)) throw new Error('Specified total value is not valid');

    // Searching for groups
    let groups = await repos.Group.find({ where:params.partial });

    return Object.freeze(groups);
  };
}
