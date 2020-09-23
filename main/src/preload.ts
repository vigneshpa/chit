import { ipcRenderer } from "electron";
interface preWindow extends Window {
    ipcrenderer?: typeof ipcRenderer;
    config?: Configuration;
}
const preWindow: preWindow = window;
preWindow.ipcrenderer = require("electron").ipcRenderer;
preWindow.config = global.config;
console.log(global.config);
console.log(global);

console.log("Loaded 'ipcrenderer' and 'config' into the window");