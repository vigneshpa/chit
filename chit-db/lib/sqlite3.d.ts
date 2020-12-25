import * as sqlite from "sqlite3";
declare class Database {
    static get OPEN_READONLY(): any;
    static get OPEN_READWRITE(): any;
    static get OPEN_CREATE(): any;
    static open(filename: string, mode?: number): Promise<Database>;
    db: sqlite.Database;
    filename: string;
    open(filename: string, mode?: number): Promise<this>;
    close(fn?: (db: this) => Promise<any>): Promise<this>;
    run(sql: string, ...args: any[]): Promise<any>;
    runMultiple(sql: string, ...istmtArgs: any[][]): Promise<this>;
    get(sql: string, ...args: any[]): Promise<any>;
    getMultiple(sql: string, ...istmtArgs: any[][]): Promise<any[]>;
    all(sql: string, ...args: any[]): Promise<any[]>;
    each(sql: string, ...args: any[]): Promise<number>;
    exec(sql: string): Promise<this>;
    transaction(fn: (db: this) => Promise<any[] | void>): Promise<any>;
    prepare(sql: string, ...args: any[]): Promise<Statement>;
}
declare class Statement {
    statement: sqlite.Statement;
    constructor(statement: sqlite.Statement);
    bind(...args: any[]): Promise<this>;
    reset(): Promise<this>;
    finalize(): Promise<void>;
    run(...args: any[]): Promise<any>;
    get(...args: any[]): Promise<any>;
    all(...args: any[]): Promise<any[]>;
    each(...args: any[]): Promise<number>;
}
export default Database;
export { Database, Statement, sqlite };
