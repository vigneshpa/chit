import Core from '../../core/src';
export type { Actions } from '../../core/src';
import initSqlJs, { SqlJsStatic } from 'sql.js';
import sqlWasm from 'sql.js/dist/sql-wasm.wasm';
import * as localforage from 'localforage';

localforage.config({
  name: 'chitDataStore',
  storeName: 'chitDataStore',
});

export async function initCore(dbName: string = 'chitDatabase') {
  // Loading SqlJs
  if (!window.SQL) window.SQL = await initSqlJs({ locateFile: () => sqlWasm });
  // Mounting localforage
  window.localforage = localforage;

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
}
export async function getDatabaseBackup(database: string = 'chitDatabase'): Promise<File> {
  const ary = await localforage.getItem<Uint8Array>(database);
  if (!ary) throw new Error('Database file does not exists');
  return new File([ary], 'backup.sqlite3', { type: 'application/vnd.sqlite3', lastModified: Date.now() });
}
export async function restoreDatabase(databaseBackup: File, database: string = 'chitDatabase') {
  await localforage.setItem(database, new Int8Array(await readFile(databaseBackup)));
  window.location.reload();
}
window.initCore = initCore;
export type CoreClass = Core;
declare global {
  interface Window {
    initCore: typeof initCore;
    SQL: SqlJsStatic;
    localforage: typeof localforage;
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
