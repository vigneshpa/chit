import { ipcRenderer } from "electron";
interface preWindow extends Window {
    ipcrenderer?: typeof ipcRenderer;
    config?: Configuration;
}
const preWindow: preWindow = window;
preWindow.ipcrenderer = require("electron").ipcRenderer;
preWindow.config = preWindow.ipcrenderer.sendSync("get-config");

console.log("Loaded 'ipcrenderer' and 'config' into the window");