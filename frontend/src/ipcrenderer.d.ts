import { IpcRenderer } from "electron";

declare global {
    interface Window{
        ipcrenderer:IpcRenderer;
    }
}