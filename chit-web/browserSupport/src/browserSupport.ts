import { Ipchost, IpciRenderer } from "chit-common";
import { default as config, updateConfig } from "./config";
import Ipci from "./Ipci";
import Dbmgmt from "./Dbmgmt";

declare global{
    interface Window{
        ipcirenderer:IpciRenderer;
        config:Configuration;
    }
}
fetch("/api/login").then((response) => response.text().then((restxt) => {
    if (!(response.status !== 401 && restxt === "LOGGED_IN")) {
        alert("You are not signed in!\nPlease Sign in");
        location.href = "/login.html";
    } else if (response.status !== 200) {
        alert("Nerwork Error!\nPlease check your internet connection.");
        location.reload();
    }
})).catch((reson) => console.log("CAUGHT_ERROR", reson));
window.config = config;
const ipci = new Ipci();
const dbmgmt = new Dbmgmt;
dbmgmt.connect();
const ipchost = new Ipchost(ipci.main, dbmgmt, config);
ipchost.on("openExternal", url=>window.open(url, "_blank"));
ipchost.on("pingRecived", ()=>console.log("Ping Recived"));
ipchost.on("showMessageBox", async options => alert(options.message));
ipchost.on("showOpenDialog", async options => prompt(options.toString()) as unknown as ChitOpenDialogReturnValue );
ipchost.on("updateConfig", async newConfig => updateConfig(newConfig));
ipchost.initialise();

window.ipcirenderer = ipci.renderer;

console.log("Finished loading browser support libraries ");