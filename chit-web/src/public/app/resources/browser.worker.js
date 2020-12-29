(function () {
    'use strict';

    class Ipchosts {
        constructor(chitIpcMain, dbmgmt, config) {
            this.chitIpcMain = chitIpcMain;
            this.dbmgmt = dbmgmt;
            this.events = {};
            this.config = config;
        }
        on(key, callback) {
            this.events[key] = callback;
        }
        async initialise() {
            this.chitIpcMain.on("ping", event => {
                console.log("Recived ping from renderer");
                console.log("Sending pong to the renderer");
                event.sender.send("pong");
                this.events.pingRecived();
            });
            this.chitIpcMain.on("create-user", async (event, data) => {
                let err;
                let response;
                console.log("\nRecived Message From Renderer to create user\n", event.sender.id, data);
                try {
                    response = await this.dbmgmt.runQuery("createUser", data.name, data.phone, data.address);
                }
                catch (err1) {
                    err = err1;
                }
                event.sender.send("create-user", err, response === null || response === void 0 ? void 0 : response.result);
            });
            this.chitIpcMain.on("create-group", async (event, data) => {
                let err;
                let response;
                console.log("Recived message from Renderer to create group", event.sender.id, data);
                try {
                    response = await this.dbmgmt.runQuery("createGroup", data.year, data.month, data.batch, data.members);
                }
                catch (err1) {
                    err = err1;
                }
                event.sender.send("create-group", err, response === null || response === void 0 ? void 0 : response.result);
            });
            this.chitIpcMain.on("get-users-data", async (event) => {
                const result = await this.dbmgmt.runQuery("listUsers");
                console.log("Sending users data to the renderer");
                event.sender.send("get-users-data", result);
            });
            this.chitIpcMain.on("get-user-details", async (event, UID) => {
                const result = await this.dbmgmt.runQuery("userDetails", UID);
                console.log("Sending " + result.name + "'s data to the renderer");
                event.sender.send("get-user-details", result);
            });
            this.chitIpcMain.on("get-groups-data", async (event) => {
                console.log("Recived message from renderer to get groups data");
                const result = await this.dbmgmt.runQuery("listGroups");
                console.log("Sending groups data to the renderer.");
                event.sender.send("get-groups-data", result);
            });
            this.chitIpcMain.on("open-forms", (event, type, args) => {
                this.events.openForm(type, args);
            });
            this.chitIpcMain.on("phone-exists", async (event, phone) => {
                let err;
                let result;
                console.log("Checking existance of phone number " + phone);
                try {
                    result = await this.dbmgmt.runQuery("checkPhone", phone);
                }
                catch (e) {
                    err = e;
                }
                console.log("Phone number " + (result ? "" : "does not ") + "exists");
                event.sender.send("phone-exists", err, result);
            });
            this.chitIpcMain.on("batch-exists", async (event, batch, month, year) => {
                let err;
                let result;
                console.log("Checking existance of Batch  " + batch + " in month " + month);
                try {
                    result = await this.dbmgmt.runQuery("checkBatch", batch, month, year);
                }
                catch (e) {
                    err = e;
                }
                console.log("Batch " + (result ? "" : "does not ") + "exists");
                event.sender.send("batch-exists", err, result);
            });
            this.chitIpcMain.on("show-message-box", (event, options) => {
                this.events.showMessageBox(options);
            });
            this.chitIpcMain.on("show-dialog", async (event, type, options) => {
                let ret;
                switch (type) {
                    case "open":
                        ret = await this.events.showOpenDialog(options);
                        break;
                    case "messagebox":
                        ret = await this.events.showMessageBox(options);
                        break;
                }
                event.sender.send("show-dialog", ret);
            });
            this.chitIpcMain.on("open-external", (event, url) => {
                this.events.openExternal(url);
            });
            this.chitIpcMain.on("get-config", event => {
                event.returnValue = this.config;
            });
            this.chitIpcMain.on("update-config", async (event, newConfig) => {
                console.log("Updating Configuration file ...");
                let done = false;
                try {
                    done = await this.events.updateConfig(newConfig);
                }
                catch (e) {
                    event.sender.send("update-config", done);
                    throw e;
                }
                event.sender.send("update-config", done);
            });
            this.chitIpcMain.on("db-run-query", async (event, query, ...args) => {
                let result = await this.dbmgmt.runQuery(query, ...args);
                event.sender.send("db-run-query", result);
            });
        }
    }

    class Dbmgmt {
        constructor(dbFile, chitDB) { }
        ;
        async connect() {
            return true;
        }
        ;
        async createDB() { }
        ;
        async closeDB() { }
        ;
        async runQuery(query, ...args) { }
        ;
    }

    class Ipcmain {
        constructor() {
            this.onceListeners = {};
            this.listeners = {};
            this.noOfPorts = 0;
        }
        ipcmainevent(connection) {
            return { sender: connection, reply: connection.send };
        }
        ;
        ;
        addPort(port) {
            let portId = this.noOfPorts;
            this.ports[portId] = port;
            this.connections[portId] = {
                id: portId,
                send(channel, ...args) {
                    console.log("IPCMain: Sending ", channel, args, " to renderer ", portId);
                    port.postMessage({ channel, args });
                }
            };
            let connection = this.connections[portId];
            this.noOfPorts++;
            port.addEventListener("message", (ev) => {
                if (ev.data.channel) {
                    console.log("IPCMain: Recived message ", ev.data, " from renderer ", portId);
                    if (this.listeners[ev.data.channel])
                        this.listeners[ev.data.channel].forEach((listener) => { var _a; return listener(this.ipcmainevent(connection), ...(_a = ev.data) === null || _a === void 0 ? void 0 : _a.args); });
                    if (this.onceListeners[ev.data.channel]) {
                        this.onceListeners[ev.data.channel].forEach((listener) => { var _a; return listener(this.ipcmainevent(connection), ...(_a = ev.data) === null || _a === void 0 ? void 0 : _a.args); });
                        this.onceListeners[ev.data.channel] = null;
                    }
                }
            });
            port.postMessage({ toIpcClass: true, id: portId });
            return connection;
        }
        on(channel, listener) {
            if (!this.listeners[channel])
                this.listeners[channel] = [];
            this.listeners[channel].push(listener);
            return this;
        }
        ;
        once(channel, listener) {
            if (!this.onceListeners[channel])
                this.onceListeners[channel] = [];
            this.onceListeners[channel].push(listener);
            return this;
        }
    }

    log("Shared worker started");
    const config = {
        "configPath": null,
        "databaseFile": {
            "isCustom": false
        },
        "isDevelopement": false,
        "theme": "system",
        "updates": {
            "autoCheck": true,
            "autoDownload": false
        },
        "vueApp": "/app"
    };
    const ipcmain = new Ipcmain();
    const ipchosts = new Ipchosts(ipcmain, new Dbmgmt("any"), config);
    self.onmessage = (e) => {
        log("Connected to ", e);
    };
    self.addEventListener("message", (ev) => {
        var _a;
        console.log("IPCMainRecive message", ev);
        if (((_a = ev.data) === null || _a === void 0 ? void 0 : _a.command) == "config") {
            log("Recive config from", ipcmain.noOfPorts);
            const port = ev.ports[0];
            let connection = ipcmain.addPort(port);
            Object.keys(ev.data.config).forEach((key) => {
                config[key] = ev.data.config[key];
            });
            if (connection.id == 1) {
                ipchosts.on("openExternal", (url) => {
                    connection.send("ipc", { command: "openExternal", url });
                });
                ipchosts.on("openForm", (type, args) => {
                    connection.send("ipc", { command: "openForm", type, args });
                });
                ipchosts.on("pingRecived", () => { });
                ipchosts.on("showMessageBox", (options) => {
                    return new Promise((resolve, reject) => {
                        connection.send("ipc", { command: "showMessageBox", options });
                        ipcmain.once("ipc-showMessageBox", (event, data) => {
                            resolve(data);
                        });
                    });
                });
                ipchosts.on("showOpenDialog", async () => { });
                ipchosts.on("updateConfig", (newConfig) => {
                    return new Promise((resolve, reject) => {
                        connection.send("ipc", { query: "updateConfig", newConfig });
                        ipcmain.once("ipc-updateConfig", (event) => {
                            resolve(true);
                        });
                    });
                });
                ipchosts.initialise();
            }
        }
    });
    function log(...args) {
        console.log("ConsoleFromWorker:", ...args);
    }

}.bind(self)());
