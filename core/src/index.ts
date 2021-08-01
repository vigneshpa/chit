import 'reflect-metadata';
import { createConnection } from 'typeorm';
import type { EntityManager, ConnectionOptions, Connection } from 'typeorm';
import type { Actions } from './Actions';
import makeActions from './Actions';
import * as Entites from './Entites';

export default class Core {
  connection?: Connection;
  isConnected: boolean = false;
  actions?: Actions;
  query?: EntityManager['query'];

  async connect(options: ConnectionOptions) {
    if (this.isConnected) throw new Error('This instance is already connected');
    this.connection = await createConnection({ ...options, entities: Object.values(Entites), synchronize: true });
    this.isConnected = true;
    this.loadActions();
    this.connection.manager.query;
  }
  async close() {
    if (!this.isConnected || !this.connection) return console.error(new Error('Connection is already closed'));
    await this.connection.close();
    this.isConnected = false;
  }
  loadActions() {
    if (!this.connection) throw new Error('Cannot load actions as the instance is not connected');
    const repos: any = {};
    for (const key in Entites) {
      if (Object.prototype.hasOwnProperty.call(Entites, key)) {
        const Entity = (<any>Entites)[key];
        repos[key] = this.connection.getRepository(Entity);
      }
    }
    this.actions = makeActions(repos);
  }
}
