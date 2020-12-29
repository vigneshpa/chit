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

    alert("Browsers are not supported yet");
    if (!window.SharedWorker) {
        alert("Shared Workers are not supported in your browser\nSome functionalities may be missing.");
    }
    const mainWorker = new SharedWorker("/app/resources/browser.worker.js", { name: "mainWorker" });
    mainWorker.port.start();
    mainWorker.port.postMessage({ query: "config", config: config$1, ipc: true });
    mainWorker.port.addEventListener("message", function (e) {
        var _a, _b, _c, _d;
        console.log("Recived ", e.data, " from shared worker");
        if (((_a = e.data) === null || _a === void 0 ? void 0 : _a.query) == "openExternal") {
            window.open(e.data.url, "_blank");
        }
        else if (((_b = e.data) === null || _b === void 0 ? void 0 : _b.query) == "openForm") {
            let searchParams = new URLSearchParams({ type: e.data.type, ...e.data.args });
            window.open("forms.html?" + searchParams.toString(), "_blank");
        }
        else if (((_c = e.data) === null || _c === void 0 ? void 0 : _c.query) == "showMessageBox") {
            let ret = { response: confirm(), checkboxChecked: false };
            mainWorker.port.postMessage({ "showMessageBox": ret, ipc: true });
        }
        else if (((_d = e.data) === null || _d === void 0 ? void 0 : _d.query) == "updateConfig") {
            updateConfig(e.data.newConfig);
            mainWorker.port.postMessage({ query: "updateConfig", ipc: true });
        }
    }, false);
    console.log("started shared worker");
    mainWorker.onerror = function (ev) {
        throw ev;
    };
    const listeners = {};
    const onceListeners = {};
    window.listeners = listeners;
    window.onceListeners = onceListeners;
    const ipcrenderer = {
        on(channel, listener) {
            if (!listeners[channel])
                listeners[channel] = [];
            listeners[channel].push(listener);
            console.log("Added listener to channel " + channel);
            return this;
        },
        send(channel, ...args) {
            console.log("Posting message ", channel, ":", args, " to the worker");
            mainWorker.port.postMessage({ channel, args });
        },
        once(channel, listener) {
            if (!onceListeners[channel])
                onceListeners[channel] = [];
            onceListeners[channel].push(listener);
            console.log("Added once listener to channel ", channel, ":", onceListeners.length);
            return this;
        },
        id: 1
    };
    const ipcrendererevent = {
        sender: ipcrenderer, senderId: 1
    };
    mainWorker.port.onmessage = function (ev) {
        if (ev.data.channel) {
            if (listeners[ev.data.channel])
                listeners[ev.data.channel].forEach((listener) => { var _a; return listener(ipcrendererevent, ...(_a = ev.data) === null || _a === void 0 ? void 0 : _a.args); });
            if (onceListeners[ev.data.channel]) {
                onceListeners[ev.data.channel].forEach((listener) => { var _a; return listener(ipcrendererevent, ...(_a = ev.data) === null || _a === void 0 ? void 0 : _a.args); });
                onceListeners[ev.data.channel] = null;
            }
        }
    };
    window.ipcrenderer = ipcrenderer;
    window.config = config$1;

}());
