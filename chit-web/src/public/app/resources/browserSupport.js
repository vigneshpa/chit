(function () {
    'use strict';

    function msToHR(ms) {
        const S = (ms / 1000);
        const s = (S % 60).toFixed(3);
        const m = Math.floor(S / 60) % 60;
        const h = Math.floor(S / 3600) % 24;
        const d = Math.floor(S / 86400);
        return s + "s " + m + "m " + h + "h " + (d == 0 ? "" : d + "d ");
    }
    var time = {
        msToHR
    };

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
    var config$1 = config;

    alert("Browsers are not supported yet");
    time.msToHR(3600000);
    if (!window.SharedWorker) {
        alert("Shared Workers are not supported in your browser\nSome functionalities may be missing.");
    }
    const mainWorker = new SharedWorker("/app/resources/browser.worker.js", { name: "mainWorker" });
    mainWorker.port.start();
    mainWorker.port.addEventListener("message", function (e) {
        console.log("Recived ", e.data, " from shared worker");
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
