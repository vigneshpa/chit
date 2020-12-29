import { Ipchost } from "chit-common";
import Dbmgmt from "./Dbmgmt";
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

const ipchosts = new Ipchost(ipcmain, new Dbmgmt("any"), config);

self.addEventListener("message", (ev) => {
  if (ev.data?.command == "config") {
    const port = ev.ports[0];
    let connection = ipcmain.addPort(port);

    //Copy new config
    Object.keys(ev.data.config).forEach((key) => {
      config[key] = ev.data.config[key];
    });

    //If main process
    if (connection.id == 1) {

      //Handeling Ipchost events
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
          })
        });
      });
      ipchosts.initialise();
    }
  }
});
function log(...args: any[]) {
  console.log("ConsoleFromWorker:", ...args);
}