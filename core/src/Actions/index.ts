import type Repos from '../Entites';
import makeCheckPhone from './checkPhone';
import makeCreateChit from './createChit';
import makeCreateGroup from './createGroup';
import makeCreateUser from './createUser';

export default function makeActions(repos: Repos) {
  return {
    checkPhone: makeCheckPhone(repos),
    createChit: makeCreateChit(repos),
    createGroup: makeCreateGroup(repos),
    createUser: makeCreateUser(repos),
  };
}
export type Actions = ReturnType<typeof makeActions>;
