import { Ipchost } from "chit-common";
import Dbmgmt from "./Dbmgmt";
import Ipcmain from "./Ipcmain";
log("Shared worker started");
declare global {
  interface Event {
    ports: readonly MessagePort[];
  }
  interface Window{
    inter
  }
}
const config: Configuration={
  "configPath":null,
  "databaseFile":{
    "isCustom":false
  },
  "isDevelopement":false,
  "theme":"system",
  "updates":{
    "autoCheck":true,
    "autoDownload":false
  },
  "vueApp":"/app"
};
self.ipcmain = new Ipcmain();self.




























//Event handlers
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
const ipchosts = new Ipchost(ipcmain, new Dbmgmt("any"), config);

self.addEventListener("connect", (ev)=>{
  let mainPort = ev.ports[0];
  let port = ev.ports[ev.ports.length - 1];
  connections++;
  log("Connections:" + connections);
  port.addEventListener("message", (e: MessageEvent<any>)=>{
    log("Recived message ", e.data);
    if (e.data.channel) {
      if (listeners[e.data.channel]) listeners[e.data.channel].forEach((listener) => listener(getEvent(e), ...e.data?.args));
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
        port.postMessage({ channel, args });
      }
    };
  }


  port.start();

  mainPort.addEventListener("message", (ev) => {
    if (ev.data.ipc) {
      if (ev.data.query == "config") {
        Object.keys(config).forEach((key)=>{
          config[key] = ev.data.config[key];
        });
        ipchosts.on("openExternal", (url)=>{
          mainPort.postMessage({query:"openExternal", url, ipc:true});
        });
        ipchosts.on("openForm", (type, args)=>{
          mainPort.postMessage({query:"openForm", type, args, ipc:true});
        });
        ipchosts.on("pingRecived", ()=>{});
        ipchosts.on("showMessageBox", (options)=>{
          return new Promise((resolve, reject)=>{
            mainPort.postMessage("showMessageBox");
            mainPort.onmessage = (evn)=>{
              if(evn.data.ipc && evn.data.showMessageBox){
                resolve(evn.data.showMessageBox);
              }
            }
          });
        });
        ipchosts.on("showOpenDialog", async ()=>{});
        ipchosts.on("updateConfig", (newConfig)=>{
          return new Promise((resolve, reject)=>{
            mainPort.postMessage({query:"updateConfig", newConfig});
            mainPort.onmessage = (env)=>{
              if(env.data.ipc && env.data.query == "updateConfig"){
                resolve(true);
              }
            }
          });
        });
        ipchosts.initialise();
      };
    }
  });

}, false);

function log(...args: any[]) {
  console.log("ConsoleFromWorker:", ...args);
}