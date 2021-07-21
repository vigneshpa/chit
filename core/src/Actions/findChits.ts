import { isFiniteUnSignInteger } from '../utils';
import type Repos from '../Entites';

export default function makeFindChits(repos: Repos) {
  /**
   * finds all chits
   * @param user uuid of user to assign this chit to
   * @param group uuid of Group this chit belongs to and Group must not be active
   * @param value Value of this chit in Rpees; It must be an integer
   */
  return async function findChits({ userUuid, groupUuid, value }: { userUuid?: string; groupUuid?: string; value?: number }) {
    // getting user object
    const user = userUuid ? await repos.User.findOne({ uuid: userUuid }) : undefined;

    // getting group object
    const group = groupUuid ? await repos.Group.findOne({ uuid: groupUuid }) : undefined;

    // Validating value
    if (value && !isFiniteUnSignInteger(value)) throw new Error('Value of an chit is not valid');

    const chits = repos.Chit.find({ user, group, value });

    return Object.freeze(chits);
  };
}
