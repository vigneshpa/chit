import config from "./config";
import { updateConfig } from "./config";
import Ipcrenderer from "./Ipcrenderer";
alert("Browsers are not supported yet");
declare global {
    interface Window {
        ipcrenderer?: ChitIpcRenderer;
        config?: Configuration;
    }
}

if (!window.SharedWorker) {
    alert("Shared Workers are not supported in your browser\nSome functionalities may be missing.");
};

//Creating worker
const mainWorker = new SharedWorker("/app/resources/browser.worker.js", { name: "mainWorker" });
console.log("started shared worker");

//Posting config
mainWorker.port.postMessage({command:"config", config});

//Creating ipcrenderer
window.ipcrenderer = new Ipcrenderer(mainWorker);
window.ipcrenderer.on("ipc", (event, data:{command:string, [key:string]:any})=>{
    switch(data.command){
        case "openExternal":
            window.open(data.url, "_blank");
            break;
        case "openForm":
            let searchParams = new URLSearchParams({type:data.type, ...data.args});
            window.open("forms.html?"+searchParams.toString(), "_blank");
            break;
        case "showMessageBox":
            let ret = {response:confirm(data.options.message), checkboxChecked:false};
            event.sender.send("ipc-showMessageBox",{command:"showMessageBox", data:ret});
            break;
        case "updateConfig":
            updateConfig(data.newConfig);
            event.sender.send("ipc-updateConfig", {command:"updateConfig"});
            break;
    }
});

//Catching errors in worker
mainWorker.onerror = function (ev) {
    throw ev;
}
window.config = config;