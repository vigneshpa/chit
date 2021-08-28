import Core from '../../core/src';
export type { Actions } from '../../core/src';
import initSqlJs, { SqlJsStatic } from 'sql.js';
import sqlWasm from 'sql.js/dist/sql-wasm.wasm';
import * as localforage from 'localforage';

localforage.config({
  name: 'chitDataStore',
  storeName: 'chitDataStore',
});

export async function initCore(dbName: string = 'chitDataBase') {
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
window.initCore = initCore;
export type CoreClass = Core;
declare global {
  interface Window {
    initCore: typeof initCore;
    SQL: SqlJsStatic;
    useLocalCore: true | undefined;
    localforage: typeof localforage;
  }
}
