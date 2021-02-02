import { Ipchost } from "chitcore";
import { default as config, updateConfig } from "./config";
import { ipciMain, ipciRenderer } from "./Ipci";
import VirtualDbmgmt from "./VirtualDbmgmt";

declare global {
    interface Window {
        ipcirenderer: IpciRenderer;
        config: Configuration;
        isOnline:boolean;
        isPWA:boolean;
    }
}
window.config = config;
const dbmgmt = new VirtualDbmgmt;
dbmgmt.connect();
const pf:pfPromisified = {
    openExternal: async url =>{window.open(url, "_blank")},
    ping: async () => console.log("Ping Recived"),
    showMessageBox: async options => confirm(options.message)?1:0,
    showOpenDialog: async options => prompt(options.toString()) as unknown as ChitOpenDialogReturnValue,
    updateConfig: async newConfig => updateConfig(newConfig),
}
const ipchost = new Ipchost(ipciMain, dbmgmt, pf, config);
ipchost.init();
ipciRenderer.init({});
window.ipcirenderer = ipciRenderer;
window.isOnline = true;
window.isPWA = false;

console.log("Finished loading browser support libraries ");