import { IpciRenderer } from "chit-common";
import { ipcRenderer } from "electron";

interface preWindow extends Window {
    ipcirenderer?: IpciRenderer;
    config?: Configuration;
}
const preWindow: preWindow = window;
preWindow.ipcirenderer = new IpciRenderer(ipcRenderer);
preWindow.ipcirenderer.call("get-config").then(value=>{preWindow.config=value});

console.log("Loading 'ipcrenderer' and 'config' into the window");