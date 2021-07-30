import { isFiniteUnSignInteger } from '../utils';
import type { RangeOf2 } from '../vendorTypes';
import Repos, { Group } from '../Entites';

export default function makeCreateGroup(repos: Repos) {
  /**
   * Creates a new Group
   * @param year Year in number
   * @param month Month of the year
   * @param batch Batch of the month
   * @param totalValue Total value of the batch
   */
  return async function createGroup({ year, month, batch, totalValue }: { year: number; month: RangeOf2<1, 12>; batch: string; totalValue: number }) {
    // Validating
    if (!isFiniteUnSignInteger(year)) throw new Error('Year is not valid');
    if (!isFiniteUnSignInteger(month)) throw new Error('Month is not valid');
    if (batch.length > 3) throw new Error('Batch cannot be longer than 3');
    if (!isFiniteUnSignInteger(totalValue)) throw new Error('Specified total value is not valid');

    // Checking existance of the group
    let count = await repos.Group.count({ year, month, batch });
    if (count > 0) throw new Error('Group already exists');

    // Creating Group Object
    let group = new Group();

    // Assigning props
    group.year = year;
    group.month = month;
    group.batch = batch;
    group.totalValue = totalValue;
    group.isActive = false;
    group.chits = [];

    // Auto generated
    group.name = year + '-' + month + '-' + batch;

    // Saving group
    group = await repos.Group.save(group);

    return Object.freeze(group);
  };
}
