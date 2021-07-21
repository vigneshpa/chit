import { isFiniteUnSignInteger } from '../utils';
import Repos, { Chit, Payment } from '../Entites';

export default function makeCreateChit(repos: Repos) {
  /**
   * Creates a new Chit
   * @param user uuid of user to assign this chit to
   * @param group uuid of Group this chit belongs to and Group must not be active
   * @param value Value of this chit in Rpees; It must be an integer
   */
  return async function createChit(userUuid: string, groupUuid: string, value: number) {
    // getting user object
    const user = await repos.User.findOne({ uuid: userUuid });
    if (!user) throw new Error('User does not exists');

    // getting group object
    const group = await repos.Group.findOne({ uuid: groupUuid });
    if (!group) throw new Error('Group does not exists');
    if (group.isActive) throw new Error('Cannot add chit to an active group');

    // Validating value
    if (!isFiniteUnSignInteger(value)) throw new Error('Value of an chit is not valid');

    //Creating chit object
    let chit = new Chit();

    // Asigning props
    chit.user = user;
    chit.group = group;
    chit.value = value;
    chit.wonAtMonth = null;
    chit.payments = [];

    // Creating Payments
    for (let imonth = 1; imonth <= 20; imonth++){
      // Creating payment object
      const payment = new Payment();

      // Asigning props
      payment.chit = chit;
      payment.imonth = imonth as any;
      payment.ispaid = false;

      // Pushing payment
      chit.payments.push(payment);
    };

    // Creating chit
    chit = await repos.Chit.save(chit);

    return Object.freeze(chit);
  };
}
