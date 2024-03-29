/**
 * This module will run in worker thread
 */
(self as any).window = self;

import Core from '@core';
import type { Actions } from '@core';
import initSqlJs, { SqlJsStatic } from 'sql.js';
import sqlWasm from 'sql.js/dist/sql-wasm.wasm';
import * as localforage from 'localforage';
import { expose } from 'comlink';
import * as JSZip from 'jszip';
import key from './backupHmacKey';

export type actionFunction = <K extends keyof Actions>(action: K, params: Parameters<Actions[K]>[0]) => ReturnType<Actions[K]>;

localforage.config({
  name: 'chitDataStore',
  storeName: 'chitDataStore',
});

let core: Promise<Core> | null = null;
let database: Uint8Array | undefined;

//@ts-ignore
const action: actionFunction = async (act, prms) => {
  if (!core) throw new Error('Core is not initilised or even starting to initilise');
  //@ts-ignore
  return await (await core).actions[act](prms);
};

async function initCore(dbName: string = 'chitDatabase'): Promise<void> {
  if (core) return console.error('Core is already started to initilise');
  core = (async () => {
    // Loading SqlJs
    if (!self.SQL) self.SQL = await initSqlJs({ locateFile: () => sqlWasm });

    database = (await localforage.getItem<Uint8Array>(dbName)) ?? undefined;

    const core = new Core();
    await core.connect({
      type: 'sqljs',
      database,
      autoSave: true,
      logging: process.env.NODE_ENV !== 'production',
      autoSaveCallback(ary: Uint8Array) {
        database = ary;
        localforage.setItem(dbName, ary);
      },
    });
    return core;
  })();
}
async function getDatabaseBackup(dbName?: string): Promise<File> {
  let db = database;
  if (dbName) db = (await localforage.getItem<Uint8Array>(dbName)) ?? undefined;
  if (!db) throw new Error('Database to backup does not exists');
  const archive = await prepareBackup(db);
  return new File([archive], 'backup.zip', { type: archive.type });
}
async function restoreDatabase(backupFile: File, database: string = 'chitDatabase'): Promise<'done' | 'invalidFile' | 'cannotVerifySignature'> {
  try {
    const zip = await new JSZip().loadAsync(backupFile);
    zip.forEach((path, file) => {
      if (file.name !== 'backup.sqlite3' && file.name !== 'signature.sha512.bin') throw new Error('Invalid file found');
    });
    const sign = await zip.file('signature.sha512.bin')?.async('arraybuffer');
    if (!sign) return 'invalidFile';
    const db = await zip.file('backup.sqlite3')?.async('uint8array');
    if (!db) return 'invalidFile';
    if (await crypto.subtle.verify('HMAC', await key, sign, db)) {
      await localforage.setItem(database, db);
      return 'done';
    } else {
      return 'cannotVerifySignature';
    }
  } catch (e) {
    return 'invalidFile';
  }
}
async function prepareBackup(db: Uint8Array): Promise<Blob> {
  const signature = await crypto.subtle.sign('HMAC', await key, db);
  const zip = new JSZip();
  zip.file('backup.sqlite3', db, { binary: true });
  zip.file('signature.sha512.bin', signature, { binary: true });
  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 } });
}
const remote = { initCore, getDatabaseBackup, restoreDatabase, action };
expose(remote);
export type exposed = typeof remote;
declare global {
  interface Window {
    SQL: SqlJsStatic;
  }
}
