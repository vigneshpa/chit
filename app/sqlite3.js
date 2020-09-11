"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlite = exports.Statement = exports.Database = void 0;
const sqlite = require("sqlite3");
exports.sqlite = sqlite;
class Database {
    static get OPEN_READONLY() { return sqlite.OPEN_READONLY; }
    static get OPEN_READWRITE() { return sqlite.OPEN_READWRITE; }
    static get OPEN_CREATE() { return sqlite.OPEN_CREATE; }
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
            let db = new sqlite.Database(filename, mode, err => {
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
        if (!(statement instanceof sqlite.Statement)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsaXRlMy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zcWxpdGUzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLGtDQUFrQztBQWdUSix3QkFBTTtBQTFTcEMsTUFBTSxRQUFRO0lBRVYsTUFBTSxLQUFLLGFBQWEsS0FBSyxPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUEsQ0FBQyxDQUFDO0lBQzFELE1BQU0sS0FBSyxjQUFjLEtBQUssT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFBLENBQUMsQ0FBQztJQUM1RCxNQUFNLEtBQUssV0FBVyxLQUFLLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQSxDQUFDLENBQUM7SUFFdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFnQixFQUFFLElBQWE7UUFDdkMsSUFBSSxFQUFFLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQTtRQUN2QixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFLRCxJQUFJLENBQUMsUUFBZ0IsRUFBRSxJQUFhO1FBQ2hDLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzdCLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUE7U0FDeEQ7YUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUNqQyxNQUFNLElBQUksU0FBUyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7U0FDN0Q7UUFDRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBOEIsRUFBRSxNQUErQixFQUFFLEVBQUU7WUFDbkYsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFO2dCQUNULE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUMsQ0FBQTthQUN0RTtZQUNELElBQUksRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUs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