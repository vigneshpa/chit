import type Repos from '../Entites';
import makeCheckPhone from './checkPhone';
import makeCreateChit from './createChit';
import makeCreateGroup from './createGroup';
import makeCreateUser from './createUser';
import makeFindChits from './findChits';
import makeFindGroups from './findGroups';
import makeFindUsers from './findUsers';

export default function makeActions(repos: Repos) {
  return {
    checkPhone: makeCheckPhone(repos),
    createChit: makeCreateChit(repos),
    createGroup: makeCreateGroup(repos),
    createUser: makeCreateUser(repos),
    findUsers: makeFindUsers(repos),
    findGroups: makeFindGroups(repos),
    findChits: makeFindChits(repos),
  };
}
export type Actions = ReturnType<typeof makeActions>;
