alert("Browsers are not supported yet");
import { time } from "chit-common";
time.msToHR(3600000);
import config from "./config";
declare global {
    interface Window {
        ipcrenderer?: ChitIpcRenderer;
        config?: Configuration;
        listeners: any;
        onceListeners: any;
    }
}

if (!window.SharedWorker) {
    alert("Shared Workers are not supported in your browser\nSome functionalities may be missing.");
};
const mainWorker = new SharedWorker("/app/resources/browser.worker.js", { name: "mainWorker" });
mainWorker.port.start();
mainWorker.port.addEventListener("message", function (e) {
    console.log("Recived ", e.data, " from shared worker");
}, false);
console.log("started shared worker");
mainWorker.onerror = function (ev) {
    throw ev;
}
const listeners: { [channel: string]: ((event: ChitIpcRendererEvent, ...args: any[]) => void)[] } = {};
const onceListeners: { [channel: string]: ((event: ChitIpcRendererEvent, ...args: any[]) => void)[] } = {};
window.listeners = listeners;
window.onceListeners = onceListeners;
const ipcrenderer: ChitIpcRenderer = {
    on(channel, listener) {
        if (!listeners[channel]) listeners[channel] = [];
        listeners[channel].push(listener);
        console.log("Added listener to channel " + channel);
        return this;
    },
    send(channel, ...args) {
        console.log("Posting message ", channel, ":", args, " to the worker")
        mainWorker.port.postMessage({ channel, args });
    },
    once(channel, listener) {
        if (!onceListeners[channel]) onceListeners[channel] = [];
        onceListeners[channel].push(listener);
        console.log("Added once listener to channel ", channel, ":", onceListeners.length);
        return this;
    },
    id: 1
};
const ipcrendererevent = {
    sender: ipcrenderer, senderId: 1
}

mainWorker.port.onmessage = function (ev) {
    if (ev.data.channel) {
        if (listeners[ev.data.channel]) listeners[ev.data.channel].forEach((listener) => listener(ipcrendererevent, ...ev.data?.args));
        if (onceListeners[ev.data.channel]) {
            onceListeners[ev.data.channel].forEach((listener) => listener(ipcrendererevent, ...ev.data?.args));
            onceListeners[ev.data.channel] = null;
        }
    }
}

window.ipcrenderer = ipcrenderer;
window.config = config;