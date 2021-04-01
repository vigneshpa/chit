import "@types/gapi";
import "@types/gapi.auth2";
import "@types/gapi.client.drive";
declare global {
    interface Window {
        ipcirenderer: IpciRenderer;
        config: Configuration;
        isOnline: boolean;
        isPWA: boolean;
        handleClientLoad:()=>void;

        //to be used by renderer
        driveSignInStateAttachListener:(listener:(isSignedIn)=>void)=>void;
        handleAuthClick:(event)=>void;
        handleSignoutClick:(event)=>void;
        backupDrive:()=>void;
    }
}
import {} from "chitcore";
import { default as config, updateConfig } from "./config.dom";
import IpciRendererPWA from "./IpciRenderer.dom";

window.config = config;
const pf: pfPromisified = {
    openExternal: async url => { window.open(url, "_blank") },
    ping: async () => console.log("Ping Recived"),
    updateConfig: async newConfig => updateConfig(newConfig),
}
const wkr = new Worker("resources/worker.js");
console.log("Started worker");
window.ipcirenderer = new IpciRendererPWA(wkr, pf);
window.ipcirenderer.init({});
window.isOnline = false;
window.isPWA = true;
import "./drivebackup.dom";
console.log("Finished loading browser support libraries ");