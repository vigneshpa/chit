import config from "./config";
import { updateConfig } from "./config";
import Ipcrenderer from "./Ipcrenderer";
declare global {
    interface Window {
        ipcrenderer?: ChitIpcRenderer;
        config?: Configuration;
    }
}
if (!window.SharedWorker) {
    alert("Shared Workers are not supported in your browser\nSome functionalities may be missing.");
};
fetch("/api/login").then((response) => response.text().then((restxt) => {
    if (!(response.status !== 401 && restxt === "LOGGED_IN")) {
        alert("You are not signed in!\nPlease Sign in");
        location.href = "/login.html";
    }else if(response.status !== 200){
        alert("Nerwork Error!\nPlease check your internet connection.");
        location.reload();
    }
})).catch((reson) => console.log("CAUGHT_ERROR", reson));

//Creating worker
const mainWorker = new SharedWorker("/app/resources/browser.worker.js", { name: "mainWorker" });
mainWorker.port.start();
console.log("started shared worker");

//Posting config
mainWorker.port.postMessage({ command: "config", config });

//Creating ipcrenderer
window.ipcrenderer = new Ipcrenderer(mainWorker);
window.ipcrenderer.on("ipc", (event, data: { command: string, [key: string]: any }) => {
    switch (data.command) {
        case "openExternal":
            window.open(data.url, "_blank");
            break;
        case "openForm":
            let searchParams = new URLSearchParams({ form: data.type, ...data.args });
            window.open("forms.html?" + searchParams.toString(), "_blank", "width=600,height=400,");
            break;
        case "showMessageBox":
            let ret = { response: confirm(data.options.message), checkboxChecked: false };
            event.sender.send("ipc-showMessageBox", { command: "showMessageBox", data: ret });
            break;
        case "updateConfig":
            updateConfig(data.newConfig);
            event.sender.send("ipc-updateConfig", { command: "updateConfig" });
            break;
    }
});

//Catching errors in worker
mainWorker.onerror = function (ev) {
    console.error(ev.error);
    console.log(ev);
    throw ev;
}
window.config = config;