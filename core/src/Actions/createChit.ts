import { isFiniteUnSignInteger } from '../utils';
import Repos, { Chit, Payment } from '../Entites';

export default function makeCreateChit(repos: Repos) {
  return async function createChit({ clientUuid, groupUuid, value }: { clientUuid: string; groupUuid: string; value: number }) {
    // getting client object
    const client = await repos.Client.findOne({ uuid: clientUuid });
    if (!client) throw new Error('Client does not exists');

    // getting group object
    const group = await repos.Group.findOne({ uuid: groupUuid });
    if (!group) throw new Error('Group does not exists');
    if (group.isActive) throw new Error('Cannot add chit to an active group');

    // Validating value
    if (!isFiniteUnSignInteger(value)) throw new Error('Value of an chit is not valid');

    //Creating chit object
    let chit = new Chit();

    // Asigning props
    chit.client = client;
    chit.group = group;
    chit.value = value;
    chit.wonAtMonth = null;
    chit.payments = [];

    // Creating Payments
    for (let imonth = 1; imonth <= 20; imonth++) {
      // Creating payment object
      const payment = new Payment();

      // Asigning props
      payment.chit = chit;
      payment.imonth = imonth as any;
      payment.ispaid = false;

      // Pushing payment
      chit.payments.push(payment);
    }

    // Creating chit
    chit = await repos.Chit.save(chit);

    return Object.freeze(chit);
  };
}
