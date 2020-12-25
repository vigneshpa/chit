alert("Browsers are not supported yet");
const ipcrenderer = {
    on() { },
    send() { },
    once() { }
};
const config = {
    isDevelopement: false,
    theme: "system",
    databaseFile: {},
    configPath: "",
    updates: {
        autoCheck: true,
        autoDownload: false
    }
};
window.ipcrenderer = ipcrenderer;
window.config = config;
