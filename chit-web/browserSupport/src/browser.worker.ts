import { Ipchost } from "chit-common";
import Dbmgmt from "./Dbmgmt.web.client";
import Ipcmain from "./Ipcmain";
log("Shared worker started");
declare global {
  interface Event {
    ports: readonly MessagePort[];
  }
  interface Window {
    ipcmain: ChitIpcMain;
  }
}
const config: Configuration = {
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
const dbmgmt = new Dbmgmt();
dbmgmt.connect();
const ipchosts = new Ipchost(ipcmain, dbmgmt, config);

self.addEventListener("connect", e => {
  const port = e.ports[0];
  port.start();
  const connection = ipcmain.addPort(port);
  console.log(connection);
  //Sending ws address
  connection.send("ipc", {command:"console", data:[dbmgmt.socket.url, dbmgmt.socketAddress]})

  //If main process
  if (connection.id === 0) {

    //Handeling Ipchost events
    ipchosts.on("openExternal", (url) => {
      connection.send("ipc", { command: "openExternal", url });
    });
    ipchosts.on("openForm", (type, args) => {
      connection.send("ipc", { command: "openForm", type, args });
    });
    ipchosts.on("pingRecived", () => { });
    ipchosts.on("showMessageBox", (options, sender) => {
      return new Promise((resolve, reject) => {
        sender.send("ipc", { command: "showMessageBox", options });
        ipcmain.once("ipc-showMessageBox", (event, data) => {
          resolve(data);
        });
      });
    });
    ipchosts.on("showOpenDialog", async (): Promise<ChitOpenDialogReturnValue> => { return; });
    ipchosts.on("updateConfig", (newConfig) => {
      return new Promise((resolve, reject) => {
        connection.send("ipc", { command: "updateConfig", newConfig });
        ipcmain.once("ipc-updateConfig", (event) => {
          resolve(true);
        })
      });
    });
    ipchosts.initialise();
  }

  //On Config
  port.addEventListener("message", (ev) => {
    console.log("SharedWorker: Recived message ", ev.data);
    if (ev.data?.command === "config") {

      //Copy new config
      Object.keys(ev.data.config).forEach((key) => {
        config[key] = ev.data.config[key];
      });
    }
  });
});
function log(...args: any[]) {
  console.log("ConsoleFromWorker:", ...args);
}