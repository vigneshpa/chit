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

    log("Shared worker started");
    var connections = 0;
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
    const listeners = {};
    const onceListeners = {};
    const ipcmain = {
        on(channel, listener) {
            if (!listeners[channel])
                listeners[channel] = [];
            listeners[channel].push(listener);
            console.log("Added listener to channel " + channel);
            return this;
        },
        once(channel, listener) {
            if (!onceListeners[channel])
                onceListeners[channel] = [];
            onceListeners[channel].push(listener);
            console.log("Added once listener to channel ", channel, ":", onceListeners.length);
            return this;
        }
    };
    const ipchosts = new Ipchosts(ipcmain, new Dbmgmt("any"), config);
    self.addEventListener("connect", (ev) => {
        let mainPort = ev.ports[0];
        let port = ev.ports[ev.ports.length - 1];
        connections++;
        log("Connections:" + connections);
        port.addEventListener("message", (e) => {
            log("Recived message ", e.data);
            if (e.data.channel) {
                if (listeners[e.data.channel])
                    listeners[e.data.channel].forEach((listener) => { var _a; return listener(getEvent(), ...(_a = e.data) === null || _a === void 0 ? void 0 : _a.args); });
                if (onceListeners[e.data.channel]) {
                    onceListeners[e.data.channel].forEach((listener) => { var _a; return listener(getEvent(), ...(_a = e.data) === null || _a === void 0 ? void 0 : _a.args); });
                    onceListeners[e.data.channel] = null;
                }
            }
        }, false);
        function getEvent(e) {
            return {
                reply() {
                },
                sender: getSender(),
                returnValue: null
            };
        }
        function getSender(e) {
            return {
                id: 1,
                send(channel, ...args) {
                    port.postMessage({ channel, args });
                }
            };
        }
        port.start();
        mainPort.addEventListener("message", (ev) => {
            if (ev.data.ipc) {
                if (ev.data.query == "config") {
                    Object.keys(config).forEach((key) => {
                        config[key] = ev.data.config[key];
                    });
                    ipchosts.on("openExternal", (url) => {
                        mainPort.postMessage({ query: "openExternal", url, ipc: true });
                    });
                    ipchosts.on("openForm", (type, args) => {
                        mainPort.postMessage({ query: "openForm", type, args, ipc: true });
                    });
                    ipchosts.on("pingRecived", () => { });
                    ipchosts.on("showMessageBox", (options) => {
                        return new Promise((resolve, reject) => {
                            mainPort.postMessage("showMessageBox");
                            mainPort.onmessage = (evn) => {
                                if (evn.data.ipc && evn.data.showMessageBox) {
                                    resolve(evn.data.showMessageBox);
                                }
                            };
                        });
                    });
                    ipchosts.on("showOpenDialog", async () => { });
                    ipchosts.on("updateConfig", (newConfig) => {
                        return new Promise((resolve, reject) => {
                            mainPort.postMessage({ query: "updateConfig", newConfig });
                            mainPort.onmessage = (env) => {
                                if (env.data.ipc && env.data.query == "updateConfig") {
                                    resolve(true);
                                }
                            };
                        });
                    });
                    ipchosts.initialise();
                }
            }
        });
    }, false);
    function log(...args) {
        console.log("ConsoleFromWorker:", ...args);
    }

}());
