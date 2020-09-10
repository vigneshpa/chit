"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlite = exports.Statement = exports.Database = void 0;
const sqlite3_1 = require("sqlite3");
exports.sqlite = sqlite3_1.default;
class Database {
    static get OPEN_READONLY() { return sqlite3_1.default.OPEN_READONLY; }
    static get OPEN_READWRITE() { return sqlite3_1.default.OPEN_READWRITE; }
    static get OPEN_CREATE() { return sqlite3_1.default.OPEN_CREATE; }
    static open(filename, mode) {
        let db = new Database();
        return db.open(filename, mode);
    }
    open(filename, mode) {
        if (typeof mode === 'undefined') {
            mode = Database.OPEN_READWRITE | Database.OPEN_CREATE;
        }
        else if (typeof mode !== 'number') {
            throw new TypeError('Database.open: mode is not a number');
        }
        return new Promise((resolve, reject) => {
            if (this.db) {
                return reject(new Error('Database.open: database is already open'));
            }
            let db = new sqlite3_1.default.Database(filename, mode, err => {
                if (err) {
                    reject(err);
                }
                else {
                    this.db = db;
                    this.filename = filename;
                    resolve(this);
                }
            });
        });
    }
    close(fn) {
        if (!this.db) {
            return Promise.reject(new Error('Database.close: database is not open'));
        }
        if (fn) {
            return fn(this).then(result => {
                return this.close().then(_ => {
                    return result;
                });
            }).catch((err) => {
                return this.close().then(_ => {
                    return Promise.reject(err);
                });
            });
        }
        return new Promise((resolve, reject) => {
            this.db.close(err => {
                if (err) {
                    reject(err);
                }
                else {
                    this.db = null;
                    resolve(this);
                }
            });
        });
    }
    run(sql, ...args) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database.run: database is not open'));
            }
            let callback = function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this);
                }
            };
            args.push(callback);
            this.db.run.apply(this.db, [sql, ...args]);
        });
    }
    get(sql, ...args) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database.get: database is not open'));
            }
            let callback = (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            };
            args.push(callback);
            this.db.get.apply(this.db, [sql, ...args]);
        });
    }
    all(sql, ...args) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database.all: database is not open'));
            }
            let callback = (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            };
            args.push(callback);
            this.db.all.apply(this.db, [sql, ...args]);
        });
    }
    each(sql, ...args) {
        if (args.length === 0 || typeof args[args.length - 1] !== 'function') {
            throw TypeError('Database.each: last arg is not a function');
        }
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database.each: database is not open'));
            }
            let callback = (err, nrows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(nrows);
                }
            };
            args.push(callback);
            this.db.each.apply(this.db, [sql, ...args]);
        });
    }
    exec(sql) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database.exec: database is not open'));
            }
            this.db.exec(sql, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this);
                }
            });
        });
    }
    transaction(fn) {
        return this.exec('BEGIN TRANSACTION').then(_ => {
            return fn(this).then(result => {
                return this.exec('END TRANSACTION').then(_ => {
                    return result;
                });
            }).catch(err => {
                return this.exec('ROLLBACK TRANSACTION').then(_ => {
                    return Promise.reject(err);
                });
            });
        });
    }
    prepare(sql, ...args) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error('Database.prepare: database is not open'));
            }
            let statement;
            let callback = (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(new Statement(statement));
                }
            };
            args.push(callback);
            statement = this.db.prepare.apply(this.db, [sql, ...args]);
        });
    }
}
exports.Database = Database;
class Statement {
    constructor(statement) {
        if (!(statement instanceof sqlite3_1.default.Statement)) {
            throw new TypeError(`Statement: 'statement' is not a statement instance`);
        }
        this.statement = statement;
    }
    bind(...args) {
        return new Promise((resolve, reject) => {
            let callback = (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this);
                }
            };
            args.push(callback);
            this.statement.bind.apply(this.statement, args);
        });
    }
    reset() {
        return new Promise((resolve, reject) => {
            this.statement.reset(_ => {
                resolve(this);
            });
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            this.statement.finalize(err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    run(...args) {
        return new Promise((resolve, reject) => {
            let callback = function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this);
                }
            };
            args.push(callback);
            this.statement.run.apply(this.statement, args);
        });
    }
    get(...args) {
        return new Promise((resolve, reject) => {
            let callback = (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            };
            args.push(callback);
            this.statement.get.apply(this.statement, args);
        });
    }
    all(...args) {
        return new Promise((resolve, reject) => {
            let callback = (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            };
            args.push(callback);
            this.statement.all.apply(this.statement, args);
        });
    }
    each(...args) {
        if (args.length === 0 || typeof args[args.length - 1] !== 'function') {
            throw TypeError('Statement.each: last arg is not a function');
        }
        return new Promise((resolve, reject) => {
            let callback = (err, nrows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(nrows);
                }
            };
            args.push(callback);
            this.statement.each.apply(this.statement, args);
        });
    }
}
exports.Statement = Statement;
exports.default = Database;
