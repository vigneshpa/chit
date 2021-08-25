import Core from '../../core/src';
export type { Actions } from '../../core/src';
import initSqlJs, { SqlJsStatic } from 'sql.js';
import sqlWasm from 'sql.js/dist/sql-wasm.wasm';

export default async function initCore(dbName?: string) {
  window.SQL = await initSqlJs({ locateFile: () => sqlWasm });
  const core = new Core();
  await core.connect({
    type: 'sqljs',
    location: dbName || 'chit',
    autoSave: true,
    logging: true,
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
  }
}
