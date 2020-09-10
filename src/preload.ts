import {ipcRenderer} from "electron";
interface preWindow extends Window{
    ipcrenderer?:typeof ipcRenderer;
}
const preWindow:preWindow = window;
preWindow.ipcrenderer = require("electron").ipcRenderer;

console.log("Loaded 'ipcrenderer' into the window");
/*contextBridge.exposeInMainWorld("ipcrenderer", {
    once:function(...args){
        console.log("Recived once ", ...args);
    },
    send:function(...args){
        console.log("recived send", ...args);
    }
});*/