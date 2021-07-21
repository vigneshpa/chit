import { isFiniteUnSignInteger } from '../utils';
import type { RangeOf2 } from '../vendorTypes';
import type Repos from '../Entites';

export default function makeFindGroups(repos: Repos) {
  /**
   * Finds all the groups whith params
   * @param year Year in number
   * @param month Month of the year
   * @param batch Batch of the month
   * @param totalValue Total value of the batch
   */
  return async function findGroups({
    year,
    month,
    batch,
    totalValue,
  }: {
    year?: number;
    month?: RangeOf2<1, 12>;
    batch?: string;
    totalValue?: number;
  }) {
    // Validating
    if (year && !isFiniteUnSignInteger(year)) throw new Error('Year is not valid');
    if (month && !isFiniteUnSignInteger(month)) throw new Error('Month is not valid');
    if (batch && batch.length > 3) throw new Error('Batch cannot be longer than 3');
    if (totalValue && !isFiniteUnSignInteger(totalValue)) throw new Error('Specified total value is not valid');

    // Searching for groups
    let groups = await repos.Group.find({ year, month, batch, totalValue });

    return Object.freeze(groups);
  };
}
