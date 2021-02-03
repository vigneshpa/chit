import {Dbmgmt, Ipchost} from "chitcore";
import IpciMainPWA from "./IpciMain.worker";
const main = new IpciMainPWA();
const pf = {} as pfPromisified;
const dbmgmt = new Dbmgmt({
  type: "sqljs",
  autoSave: true,
  location: "main",
  useLocalForage: true,
  sqlJsConfig: {
    locateFile: file => `./${file}`
  },
});
const ipchost = new Ipchost(main, dbmgmt, pf);
ipchost.init();
dbmgmt.connect();