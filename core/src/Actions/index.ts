import type Repos from '../Entites';
import makeCheckPhone from './checkPhone';
import makeCreateChit from './createChit';
import makeCreateGroup from './createGroup';
import makeCreateClient from './createClient';
import makeFindChits from './findChits';
import makeFindGroups from './findGroups';
import makeFindClients from './findClients';
import makeCheckGroup from './checkGroup';

export default function makeActions(repos: Repos) {
  return {
    /**
     * checks for existance of a phone number
     * @param {Object} params parameters to check phone
     * @param {string} params.phone Phone number
     * @returns {string} weather phone number exists
     */
    checkPhone: makeCheckPhone(repos),
    /**
     * checks for existance of a group
     * @param {Object} params parameters to check group
     * @param {string} params.name name of the group
     * @returns {boolean} weather group exists
     */
    checkGroup: makeCheckGroup(repos),
    /**
     * Creates a new Chit
     * @param {Object} params parameters to create Chit
     * @param {string} params.client uuid of client to assign this chit to
     * @param {string} params.group uuid of Group this chit belongs to and Group must not be active
     * @param {number} params.value Value of this chit in Rupees; It must be an integer
     * @returns created chit
     */
    createChit: makeCreateChit(repos),
    /**
     * Creates a new Group
     * @param {Object} params parameters to create Group
     * @param {number} params.year Year in number
     * @param {number} params.month Month of the year
     * @param {string} params.batch Batch of the month
     * @param {number} params.totalValue Total value of the batch
     * @returns created group
     */
    createGroup: makeCreateGroup(repos),
    /**
     * Creates a new Client
     * @param {Object} params parameters to create group
     * @param {string} params.name Name of the client
     * @param {string} params.phone Phone number of the client
     * @param {string} params.address Address of the client
     * @returns created client
     */
    createClient: makeCreateClient(repos),
    /**
     * Searches and Lists all the Clients
     * @param {Object} params params object
     * @param params.partial partial object of client
     */
    findClients: makeFindClients(repos),
    /**
     * Finds all the groups whith params
     * @param {Object} params params object
     * @param params.partial partial object of group
     */
    findGroups: makeFindGroups(repos),
    /**
     * Finds all chits
     * @param {Object} params params object
     * @param params.partial partial object of chit
     */
    findChits: makeFindChits(repos),
  };
}
export type Actions = ReturnType<typeof makeActions>;
