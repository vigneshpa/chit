alert("Browsers are not supported yet");
import { time } from "chit-common";
time.msToHR(360000);
declare global {
    interface Window {
        ipcrenderer?: ChitIpcRenderer;
        config?: Configuration;
    }
}
const events = {};
const ipcrenderer = {
    on(...args:any[]) {
        return this;
    },
    send(...args:any[]) { },
    once(...args:any[]) {
        return this;
    },
    id:1
};
const config: Configuration = {
    isDevelopement: false,
    theme: "system",
    databaseFile: {},
    configPath: "",
    updates: {
        autoCheck: true,
        autoDownload: false
    },
    vueApp: null
};
window.ipcrenderer = ipcrenderer;
window.config = config;