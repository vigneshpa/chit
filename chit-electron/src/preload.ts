import { IpciRenderer } from "chit-common";

interface preWindow extends Window {
    ipcrenderer?: IpciRenderer;
    config?: Configuration;
}
const preWindow: preWindow = window;
preWindow.ipcrenderer = require("electron").ipcRenderer;
preWindow.ipcrenderer.call("get-config").then((value=>{preWindow.config=value}));

console.log("Loaded 'ipcrenderer' and 'config' into the window");