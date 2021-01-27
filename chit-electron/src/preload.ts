import IpciRenderer from "./IpciRenderer";
import { ipcRenderer } from "electron";

interface preWindow extends Window {
    ipcirenderer?: IpciRenderer;
    config?: Configuration;
}
const preWindow: preWindow = window;
preWindow.ipcirenderer = new IpciRenderer(ipcRenderer);
ipcRenderer.invoke("getConfig").then(value=>{preWindow.config=value});

console.log("Loading 'ipcrenderer' and 'config' into the window");