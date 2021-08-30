/**
 * This module will run in worker thread
 */
(self as any).window = self;

import Core from '../../core/src';
import type { Actions } from '../../core/src';
export type { Actions };
import initSqlJs, { SqlJsStatic } from 'sql.js';
import sqlWasm from 'sql.js/dist/sql-wasm.wasm';
import * as localforage from 'localforage';
import { expose } from 'comlink';

export type actionFunction = <K extends keyof Actions>(action: K, params: Parameters<Actions[K]>[0]) => ReturnType<Actions[K]>;

localforage.config({
  name: 'chitDataStore',
  storeName: 'chitDataStore',
});

let core: Promise<Core> | null = null;

//@ts-ignore
const action: actionFunction = async (act, prms) => {
  if (!core) throw new Error('Core is not initilised or even starting to initilise');
  //@ts-ignore
  return await (await core).actions[act](prms);
};

async function initCore(dbName: string = 'chitDatabase'): Promise<void> {
  if (core) return console.error('Core is already atarted to initilise');
  core = (async () => {
    // Loading SqlJs
    if (!self.SQL) self.SQL = await initSqlJs({ locateFile: () => sqlWasm });

    const database = (await localforage.getItem<Uint8Array>(dbName)) ?? undefined;

    const core = new Core();
    await core.connect({
      type: 'sqljs',
      database,
      autoSave: true,
      logging: process.env.NODE_ENV !== 'production',
      autoSaveCallback(ary: Uint8Array) {
        localforage.setItem(dbName, ary);
      },
    });
    return core;
  })();
}
async function getDatabaseBackup(database: string = 'chitDatabase'): Promise<File> {
  const ary = await localforage.getItem<Uint8Array>(database);
  if (!ary) throw new Error('Database file does not exists');
  return new File([ary], 'backup.sqlite3', { type: 'application/vnd.sqlite3', lastModified: Date.now() });
}
async function restoreDatabase(databaseBackup: File, database: string = 'chitDatabase') {
  await localforage.setItem(database, new Int8Array(await readFile(databaseBackup)));
}
const remote = { initCore, getDatabaseBackup, restoreDatabase, action };
expose(remote);
export type exposed = typeof remote;
export type CoreClass = Core;
declare global {
  interface Window {
    SQL: SqlJsStatic;
  }
}
function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', e => resolve((e as any).target.result));
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(file);
  });
}
