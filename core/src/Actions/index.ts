import type Repos from '../Entites';
import makeCheckPhone from './checkPhone';
import makeCreateChit from './createChit';
import makeCreateGroup from './createGroup';
import makeCreateClient from './createClient';
import makeFindChits from './findChits';
import makeFindGroups from './findGroups';
import makeFindClients from './findClients';

export default function makeActions(repos: Repos) {
  return {
    checkPhone: makeCheckPhone(repos),
    createChit: makeCreateChit(repos),
    createGroup: makeCreateGroup(repos),
    createClient: makeCreateClient(repos),
    findClients: makeFindClients(repos),
    findGroups: makeFindGroups(repos),
    findChits: makeFindChits(repos),
  };
}
export type Actions = ReturnType<typeof makeActions>;
