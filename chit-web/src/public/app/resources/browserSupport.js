(function () {
    'use strict';

    let config = {
        isDevelopement: false,
        theme: "system",
        databaseFile: {},
        configPath: "",
        updates: {
            autoCheck: true,
            autoDownload: false
        },
        vueApp: null
    };
    let ls = localStorage.getItem('config');
    if (ls) {
        config = JSON.parse(ls);
    }
    else {
        localStorage.setItem("config", JSON.stringify(config));
    }
    function updateConfig(newConfig) {
        localStorage.setItem("config", JSON.stringify(newConfig));
    }
    var config$1 = config;

    class Ipcrenderer {
        constructor(worker) {
            this.worker = worker;
            this.port = this.worker.port;
            this.onceListeners = {};
            this.listeners = {};
            this.worker.port.onmessage = (ev) => {
                if (ev.data.channel) {
                    console.log("IPCRenderer: Recived message ", ev.data, " from main");
                    if (this.listeners[ev.data.channel])
                        this.listeners[ev.data.channel].forEach((listener) => { var _a; return listener(this.ipcrendererevent(), ...(_a = ev.data) === null || _a === void 0 ? void 0 : _a.args); });
                    if (this.onceListeners[ev.data.channel]) {
                        this.onceListeners[ev.data.channel].forEach((listener) => { var _a; return listener(this.ipcrendererevent(), ...(_a = ev.data) === null || _a === void 0 ? void 0 : _a.args); });
                        this.onceListeners[ev.data.channel] = null;
                    }
                }
            };
            this.port.addEventListener("message", (ev) => {
                var _a;
                if ((_a = ev.data) === null || _a === void 0 ? void 0 : _a.toIpcClass) {
                    this.id = ev.data.id;
                    if (this.id = 0)
                        alert("This tab holds the main process!\nDon't close this.");
                }
            });
        }
        ipcrendererevent() {
            return { sender: this, senderId: this.id };
        }
        ;
        ;
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
        send(channel, ...args) {
            console.log("Posting message ", channel, ":", args, " to the worker");
            this.port.postMessage({ channel, args });
        }
        ;
    }

    alert("Browsers are not supported yet");
    if (!window.SharedWorker) {
        alert("Shared Workers are not supported in your browser\nSome functionalities may be missing.");
    }
    const mainWorker = new SharedWorker("/app/resources/browser.worker.js", { name: "mainWorker" });
    console.log("started shared worker");
    mainWorker.port.postMessage({ command: "config", config: config$1 });
    window.ipcrenderer = new Ipcrenderer(mainWorker);
    window.ipcrenderer.on("ipc", (event, data) => {
        switch (data.command) {
            case "openExternal":
                window.open(data.url, "_blank");
                break;
            case "openForm":
                let searchParams = new URLSearchParams({ type: data.type, ...data.args });
                window.open("forms.html?" + searchParams.toString(), "_blank");
                break;
            case "showMessageBox":
                let ret = { response: confirm(data.options.message), checkboxChecked: false };
                event.sender.send("ipc-showMessageBox", { command: "showMessageBox", data: ret });
                break;
            case "updateConfig":
                updateConfig(data.newConfig);
                event.sender.send("ipc-updateConfig", { command: "updateConfig" });
                break;
        }
    });
    mainWorker.onerror = function (ev) {
        throw ev;
    };
    window.config = config$1;

}());
