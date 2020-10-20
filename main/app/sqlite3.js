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
        return new Promise(async (resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database.close: database is not open'));
            }
            if (fn && typeof fn === "function") {
                try {
                    await fn(this);
                }
                catch (err) {
                    reject(err);
                    return;
                }
            }
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
    async runMultiple(sql, ...istmtArgs) {
        let sqlSplited = sql.split(";");
        await this.exec('BEGIN TRANSACTION');
        let i = 0;
        for (let sqlStatement of sqlSplited) {
            sqlStatement = sqlStatement.trim();
            if (!istmtArgs[i])
                istmtArgs[i] = [];
            if (!sqlStatement)
                continue;
            try {
                console.log("Executing SQL:", sqlStatement, istmtArgs[i]);
                await this.run(sqlStatement, ...istmtArgs[i]);
            }
            catch (e) {
                console.log(e);
                this.db.exec("ROLLBACK TRANSACTION");
                throw e;
            }
            i++;
        }
        ;
        await this.exec('END TRANSACTION');
        return this;
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
    async getMultiple(sql, ...istmtArgs) {
        const result = [];
        const sqlSplited = sql.split(";");
        await this.exec('BEGIN TRANSACTION');
        let i = 0;
        for (let sqlStatement of sqlSplited) {
            sqlStatement = sqlStatement.trim();
            if (!sqlStatement)
                continue;
            try {
                console.log("Executing SQL:", sqlStatement, istmtArgs[i]);
                result.push(await this.get(sqlStatement, ...istmtArgs[i]));
            }
            catch (e) {
                console.log(e);
                this.db.exec("ROLLBACK TRANSACTION");
                throw e;
            }
            i++;
        }
        ;
        await this.exec('END TRANSACTION');
        return result;
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
        return new Promise(async (resolve, reject) => {
            await this.exec('BEGIN TRANSACTION');
            try {
                const result = await fn(this);
                await this.exec('COMMIT');
                await this.exec('END TRANSACTION');
                resolve(result);
            }
            catch (err) {
                this.exec('ROLLBACK TRANSACTION');
                reject(err);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsaXRlMy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zcWxpdGUzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLGtDQUFrQztBQW1YSix3QkFBTTtBQTdXcEMsTUFBTSxRQUFRO0lBRVYsTUFBTSxLQUFLLGFBQWEsS0FBSyxPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUEsQ0FBQyxDQUFDO0lBQzFELE1BQU0sS0FBSyxjQUFjLEtBQUssT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFBLENBQUMsQ0FBQztJQUM1RCxNQUFNLEtBQUssV0FBVyxLQUFLLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQSxDQUFDLENBQUM7SUFFdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFnQixFQUFFLElBQWE7UUFDdkMsSUFBSSxFQUFFLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQTtRQUN2QixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFLRCxJQUFJLENBQUMsUUFBZ0IsRUFBRSxJQUFhO1FBQ2hDLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzdCLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUE7U0FDeEQ7YUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUNqQyxNQUFNLElBQUksU0FBUyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7U0FDN0Q7UUFDRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBOEIsRUFBRSxNQUErQixFQUFFLEVBQUU7WUFDbkYsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFO2dCQUNULE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUMsQ0FBQTthQUN0RTtZQUNELElBQUksRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUMvQyxJQUFJLEdBQUcsRUFBRTtvQkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ2Q7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7b0JBQ1osSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7b0JBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFDaEI7WUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELEtBQUssQ0FBQyxFQUErQjtRQWVqQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUE4QixFQUFFLE1BQTRCLEVBQUUsRUFBRTtZQUN0RixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDVixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxDQUFDO2FBQzdEO1lBQ0QsSUFBSSxFQUFFLElBQUksT0FBTyxFQUFFLEtBQUssVUFBVSxFQUFFO2dCQUNoQyxJQUFJO29CQUNBLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNsQjtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDVixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ1osT0FBTztpQkFDVjthQUNKO1lBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2hCLElBQUksR0FBRyxFQUFFO29CQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDZDtxQkFBTTtvQkFDSCxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQTtvQkFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ2hCO1lBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBVyxFQUFFLEdBQUcsSUFBVztRQUMzQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBeUMsRUFBRSxNQUE0QixFQUFFLEVBQUU7WUFDM0YsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7Z0JBQ1YsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxDQUFBO2FBQ2pFO1lBRUQsSUFBSSxRQUFRLEdBQUcsVUFBVSxHQUFVO2dCQUMvQixJQUFJLEdBQUcsRUFBRTtvQkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ2Q7cUJBQU07b0JBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUNoQjtZQUNMLENBQUMsQ0FBQTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBVyxFQUFFLEdBQUcsU0FBa0I7UUFDaEQsSUFBSSxVQUFVLEdBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixLQUFLLElBQUksWUFBWSxJQUFJLFVBQVUsRUFBRTtZQUNqQyxZQUFZLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25DLElBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUM7WUFDakMsSUFBRyxDQUFDLFlBQVk7Z0JBQUMsU0FBUztZQUMxQixJQUFJO2dCQUNBLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxFQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDakQ7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxDQUFDO2FBQ1g7WUFDRCxDQUFDLEVBQUUsQ0FBQztTQUNQO1FBQUEsQ0FBQztRQUNGLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBVyxFQUFFLEdBQUcsSUFBVztRQUMzQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBMkIsRUFBRSxNQUE0QixFQUFFLEVBQUU7WUFDN0UsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7Z0JBQ1YsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxDQUFBO2FBQ2pFO1lBQ0QsSUFBSSxRQUFRLEdBQUcsQ0FBQyxHQUFVLEVBQUUsR0FBUSxFQUFFLEVBQUU7Z0JBQ3BDLElBQUksR0FBRyxFQUFFO29CQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDZDtxQkFBTTtvQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ2Y7WUFDTCxDQUFDLENBQUE7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ25CLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUM5QyxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQVcsRUFBRSxHQUFHLFNBQWtCO1FBQ2hELE1BQU0sTUFBTSxHQUFTLEVBQUUsQ0FBQztRQUN4QixNQUFNLFVBQVUsR0FBYSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLEtBQUssSUFBSSxZQUFZLElBQUksVUFBVSxFQUFFO1lBQ2pDLFlBQVksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkMsSUFBRyxDQUFDLFlBQVk7Z0JBQUMsU0FBUztZQUMxQixJQUFJO2dCQUNBLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxFQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlEO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsQ0FBQzthQUNYO1lBQ0QsQ0FBQyxFQUFFLENBQUM7U0FDUDtRQUFBLENBQUM7UUFDRixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNuQyxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsR0FBRyxDQUFDLEdBQVcsRUFBRSxHQUFHLElBQVc7UUFDM0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQThCLEVBQUUsTUFBNEIsRUFBRSxFQUFFO1lBQ2hGLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO2dCQUNWLE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsQ0FBQTthQUNqRTtZQUNELElBQUksUUFBUSxHQUFHLENBQUMsR0FBVSxFQUFFLElBQVcsRUFBRSxFQUFFO2dCQUN2QyxJQUFJLEdBQUcsRUFBRTtvQkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ2Q7cUJBQU07b0JBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUNoQjtZQUNMLENBQUMsQ0FBQTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELElBQUksQ0FBQyxHQUFXLEVBQUUsR0FBRyxJQUFXO1FBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7WUFDbEUsTUFBTSxTQUFTLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtTQUMvRDtRQUNELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFnQyxFQUFFLE1BQTRCLEVBQUUsRUFBRTtZQUNsRixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDVixPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUE7YUFDbEU7WUFDRCxJQUFJLFFBQVEsR0FBRyxDQUFDLEdBQVUsRUFBRSxLQUFhLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxHQUFHLEVBQUU7b0JBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUNkO3FCQUFNO29CQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtpQkFDakI7WUFDTCxDQUFDLENBQUE7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ25CLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUMvQyxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxJQUFJLENBQUMsR0FBVztRQUNaLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUE4QixFQUFFLE1BQTRCLEVBQUUsRUFBRTtZQUNoRixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDVixPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUE7YUFDbEU7WUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BCLElBQUksR0FBRyxFQUFFO29CQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDZDtxQkFBTTtvQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ2hCO1lBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxXQUFXLENBQUMsRUFBdUM7UUFDL0MsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBNkIsRUFBRSxNQUE2QixFQUFFLEVBQUU7WUFDdEYsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDckMsSUFBSTtnQkFDQSxNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ25CO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDZjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBWVAsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFXLEVBQUUsR0FBRyxJQUFXO1FBQy9CLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUF1QyxFQUFFLE1BQTRCLEVBQUUsRUFBRTtZQUN6RixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDVixPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDLENBQUE7YUFDckU7WUFDRCxJQUFJLFNBQTJCLENBQUE7WUFDL0IsSUFBSSxRQUFRLEdBQUcsQ0FBQyxHQUFVLEVBQUUsRUFBRTtnQkFDMUIsSUFBSSxHQUFHLEVBQUU7b0JBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUNkO3FCQUFNO29CQUNILE9BQU8sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO2lCQUNwQztZQUNMLENBQUMsQ0FBQTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDbkIsU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUM5RCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSjtBQXFIUSw0QkFBUTtBQS9HakIsTUFBTSxTQUFTO0lBSVgsWUFBWSxTQUEyQjtRQUNuQyxJQUFJLENBQUMsQ0FBQyxTQUFTLFlBQVksTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzFDLE1BQU0sSUFBSSxTQUFTLENBQUMsb0RBQW9ELENBQUMsQ0FBQTtTQUM1RTtRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0lBQzlCLENBQUM7SUFFRCxJQUFJLENBQUMsR0FBRyxJQUFXO1FBQ2YsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQThCLEVBQUUsTUFBNEIsRUFBRSxFQUFFO1lBQ2hGLElBQUksUUFBUSxHQUFHLENBQUMsR0FBVSxFQUFFLEVBQUU7Z0JBQzFCLElBQUksR0FBRyxFQUFFO29CQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDZDtxQkFBTTtvQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ2hCO1lBQ0wsQ0FBQyxDQUFBO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxLQUFLO1FBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQThCLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDMUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqQixDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBNEIsRUFBRSxNQUE0QixFQUFFLEVBQUU7WUFDOUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzFCLElBQUksR0FBRyxFQUFFO29CQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDZDtxQkFBTTtvQkFDSCxPQUFPLEVBQUUsQ0FBQTtpQkFDWjtZQUNMLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsR0FBRyxDQUFDLEdBQUcsSUFBVztRQUNkLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUF5QyxFQUFFLE1BQTRCLEVBQUUsRUFBRTtZQUUzRixJQUFJLFFBQVEsR0FBRyxVQUFVLEdBQVU7Z0JBQy9CLElBQUksR0FBRyxFQUFFO29CQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDZDtxQkFBTTtvQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2pCO1lBQ0wsQ0FBQyxDQUFBO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNsRCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBRyxJQUFXO1FBQ2QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQTRCLEVBQUUsTUFBNEIsRUFBRSxFQUFFO1lBQzlFLElBQUksUUFBUSxHQUFHLENBQUMsR0FBVSxFQUFFLEdBQVEsRUFBRSxFQUFFO2dCQUNwQyxJQUFJLEdBQUcsRUFBRTtvQkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ2Q7cUJBQU07b0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUNmO1lBQ0wsQ0FBQyxDQUFBO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNsRCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBRyxJQUFXO1FBQ2QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQThCLEVBQUUsTUFBNEIsRUFBRSxFQUFFO1lBQ2hGLElBQUksUUFBUSxHQUFHLENBQUMsR0FBVSxFQUFFLElBQVcsRUFBRSxFQUFFO2dCQUN2QyxJQUFJLEdBQUcsRUFBRTtvQkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ2Q7cUJBQU07b0JBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUNoQjtZQUNMLENBQUMsQ0FBQTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsSUFBSSxDQUFDLEdBQUcsSUFBVztRQUNmLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7WUFDbEUsTUFBTSxTQUFTLENBQUMsNENBQTRDLENBQUMsQ0FBQTtTQUNoRTtRQUNELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFnQyxFQUFFLE1BQTRCLEVBQUUsRUFBRTtZQUNsRixJQUFJLFFBQVEsR0FBRyxDQUFDLEdBQVUsRUFBRSxLQUFhLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxHQUFHLEVBQUU7b0JBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUNkO3FCQUFNO29CQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtpQkFDakI7WUFDTCxDQUFDLENBQUE7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ25ELENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztDQUNKO0FBT2tCLDhCQUFTO0FBRDVCLGtCQUFlLFFBQVEsQ0FBQyJ9