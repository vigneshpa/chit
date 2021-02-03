import {} from "chitcore";
import { default as config, updateConfig } from "./config";
import IpciRendererPWA from "./IpciRenderer";

declare global {
    interface Window {
        ipcirenderer: IpciRenderer;
        config: Configuration;
        isOnline: boolean;
        isPWA: boolean;
    }
}
window.config = config;
const pf: pfPromisified = {
    openExternal: async url => { window.open(url, "_blank") },
    ping: async () => console.log("Ping Recived"),
    showMessageBox: async options => confirm(options.message) ? 1 : 0,
    showOpenDialog: async options => prompt(options.toString()) as unknown as ChitOpenDialogReturnValue,
    updateConfig: async newConfig => updateConfig(newConfig),
}
const wkr = new Worker("resources/worker.js");
console.log("Started worker");
window.ipcirenderer = new IpciRendererPWA(wkr, pf);
window.ipcirenderer.init({});
window.isOnline = false;
window.isPWA = true;
console.log("Finished loading browser support libraries ");