import {EventEmitter} from "events";
declare global {
  module sqlite3 {

    export const OPEN_READONLY: number;
    export const OPEN_READWRITE: number;
    export const OPEN_CREATE: number;
    export const OPEN_SHAREDCACHE: number;
    export const OPEN_PRIVATECACHE: number;
    export const OPEN_URI: number;

    export const cached: {
      Database(filename: string, callback?: (this: Database, err: Error | null) => void): Database;
      Database(filename: string, mode?: number, callback?: (this: Database, err: Error | null) => void): Database;
    };

    export interface RunResult extends Statement {
      lastID: number;
      changes: number;
    }

    export class Statement {
      bind(callback?: (err: Error | null) => void): this;
      bind(...params: any[]): this;

      reset(callback?: (err: null) => void): this;

      finalize(callback?: (err: Error) => void): Database;

      run(callback?: (err: Error | null) => void): this;
      run(params: any, callback?: (this: RunResult, err: Error | null) => void): this;
      run(...params: any[]): this;

      get(callback?: (err: Error | null, row?: any) => void): this;
      get(params: any, callback?: (this: RunResult, err: Error | null, row?: any) => void): this;
      get(...params: any[]): this;

      all(callback?: (err: Error | null, rows: any[]) => void): this;
      all(params: any, callback?: (this: RunResult, err: Error | null, rows: any[]) => void): this;
      all(...params: any[]): this;

      each(callback?: (err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this;
      each(params: any, callback?: (this: RunResult, err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this;
      each(...params: any[]): this;
    }

    export class Database extends EventEmitter {
      constructor(filename: string, callback?: (err: Error | null) => void);
      constructor(filename: string, mode?: number, callback?: (err: Error | null) => void);

      close(callback?: (err: Error | null) => void): void;

      run(sql: string, callback?: (this: RunResult, err: Error | null) => void): this;
      run(sql: string, params: any, callback?: (this: RunResult, err: Error | null) => void): this;
      run(sql: string, ...params: any[]): this;

      get(sql: string, callback?: (this: Statement, err: Error | null, row: any) => void): this;
      get(sql: string, params: any, callback?: (this: Statement, err: Error | null, row: any) => void): this;
      get(sql: string, ...params: any[]): this;

      all(sql: string, callback?: (this: Statement, err: Error | null, rows: any[]) => void): this;
      all(sql: string, params: any, callback?: (this: Statement, err: Error | null, rows: any[]) => void): this;
      all(sql: string, ...params: any[]): this;

      each(sql: string, callback?: (this: Statement, err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this;
      each(sql: string, params: any, callback?: (this: Statement, err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this;
      each(sql: string, ...params: any[]): this;

      exec(sql: string, callback?: (this: Statement, err: Error | null) => void): this;

      prepare(sql: string, callback?: (this: Statement, err: Error | null) => void): Statement;
      prepare(sql: string, params: any, callback?: (this: Statement, err: Error | null) => void): Statement;
      prepare(sql: string, ...params: any[]): Statement;

      serialize(callback?: () => void): void;
      parallelize(callback?: () => void): void;

      on(event: "trace", listener: (sql: string) => void): this;
      on(event: "profile", listener: (sql: string, time: number) => void): this;
      on(event: "error", listener: (err: Error) => void): this;
      on(event: "open" | "close", listener: () => void): this;
      on(event: string, listener: (...args: any[]) => void): this;

      configure(option: "busyTimeout", value: number): void;
      interrupt(): void;
    }

    export function verbose(): sqlite3;

    export interface sqlite3 {
      OPEN_READONLY: number;
      OPEN_READWRITE: number;
      OPEN_CREATE: number;
      OPEN_SHAREDCACHE: number;
      OPEN_PRIVATECACHE: number;
      OPEN_URI: number;
      cached: typeof cached;
      RunResult: RunResult;
      Statement: typeof Statement;
      Database: typeof Database;
      verbose(): this;
    }
  }
  class ChitDatabase {
    static get OPEN_READONLY(): number;
    static get OPEN_READWRITE(): number;
    static get OPEN_CREATE(): number;
    static open(filename: string, mode?: number): Promise<ChitDatabase>;
    db: sqlite3.Database;
    filename: string;
    open(filename: string, mode?: number): Promise<this>;
    close(fn?: (db: this) => Promise<any>): Promise<this>;
    run(sql: string, ...args: any[]): Promise<sqlite3.Database>;
    runMultiple(sql: string, ...istmtArgs: any[][]): Promise<this>;
    get(sql: string, ...args: any[]): Promise<any>;
    getMultiple(sql: string, ...istmtArgs: any[][]): Promise<any[]>;
    all(sql: string, ...args: any[]): Promise<any[]>;
    each(sql: string, ...args: any[]): Promise<number>;
    exec(sql: string): Promise<this>;
    transaction(fn: (db: this) => Promise<any[] | void>): Promise<any>;
    prepare(sql: string, ...args: any[]): Promise<ChitStatement>;
  }
  class ChitStatement {
    statement: sqlite3.Statement;
    constructor(statement: sqlite3.Statement);
    bind(...args: any[]): Promise<this>;
    reset(): Promise<this>;
    finalize(): Promise<void>;
    run(...args: any[]): Promise<sqlite3.Statement>;
    get(...args: any[]): Promise<any>;
    all(...args: any[]): Promise<any[]>;
    each(...args: any[]): Promise<number>;
  }
  interface ChitMessageBoxOptions {
    type?: string;
    buttons?: string[];
    defaultId?: number;
    title?: string;
    message: string;
    detail?: string;
    checkboxLabel?: string;
    checkboxChecked?: boolean;
    icon?: any;
    cancelId?: number;
    noLink?: boolean;
    normalizeAccessKeys?: boolean;
  }
  interface ChitOpenDialogOptions {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: {
      extensions: string[];
      name: string;
    }[];
    properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>;
    message?: string;
    securityScopedBookmarks?: boolean;
  }
  interface ChitOpenDialogReturnValue {
    /**
     * whether or not the dialog was canceled.
     */
    canceled: boolean;
    /**
     * An array of file paths chosen by the user. If the dialog is cancelled this will
     * be an empty array.
     */
    filePaths: string[];
    /**
     * An array matching the `filePaths` array of base64 encoded strings which contains
     * security scoped bookmark data. `securityScopedBookmarks` must be enabled for
     * this to be populated. (For return values, see table here.)
     *
     * @platform darwin,mas
     */
    bookmarks?: string[];
  }
}
export {};