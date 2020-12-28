log("Shared worker started");
import { Ipchost } from "chit-common";
import Dbmgmt from "./Dbmgmt";
import config from "./Cofig";
declare global {
  interface Event {
    ports: readonly MessagePort[];
  }
}
var connections = 0; // count active connections
const listeners: { [channel: string]: ((event: ChitIpcMainEvent, ...args: any[]) => void)[] } = {};
const onceListeners: { [channel: string]: ((event: ChitIpcMainEvent, ...args: any[]) => void)[] } = {};
const ipcmain: ChitIpcMain = {
  on(channel, listener) {
    if (!listeners[channel]) listeners[channel] = [];
    listeners[channel].push(listener);
    console.log("Added listener to channel " + channel);
    return this;
  },
  once(channel, listener) {
    if (!onceListeners[channel]) onceListeners[channel] = [];
    onceListeners[channel].push(listener);
    console.log("Added once listener to channel ", channel, ":", onceListeners.length);
    return this;
  }
};


let ipchosts = new Ipchost(ipcmain, new Dbmgmt(), config);

self.addEventListener("connect", function (ev) {
  let port = ev.ports[connections];
  connections++;
  log("Connections:" + connections);
  port.addEventListener("message", function (e: MessageEvent<any>) {
    if (e.data.channel) {
      if (listeners[e.data.channel]) listeners[e.data.channel].forEach((listener) => listener({
        reply() {
        },
        sender: getSender(e), returnValue: null
      }, ...e.data?.args));
      if (onceListeners[e.data.channel]) {
        onceListeners[e.data.channel].forEach((listener) => listener(getEvent(e), ...e.data?.args));
        onceListeners[e.data.channel] = null;
      }
    }
  }, false);


  function getEvent(e: MessageEvent<any>): ChitIpcMainEvent {
    return {
      reply() {
      },
      sender: getSender(e),
      returnValue: null
    };
  }

  function getSender(e: MessageEvent<any>): ChitIpcMainWebcontents {
    return {
      id: 1,
      send(channel, ...args) {
        port.postMessage({channel, args});
      }
    };
  }


  port.start();
}, false);



function log(...args: any[]) {
  console.log("ConsoleFromWorker:", ...args);
}