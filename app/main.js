"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Starting Electron . . . ");
const electron_1 = require("electron");
const path_1 = require("path");
let splash;
let mainWindow;
electron_1.app.on("ready", function (launchInfo) {
    splash = new electron_1.BrowserWindow({
        width: 500,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
        },
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        transparent: false,
    });
    splash.loadFile(__dirname + "/resources/splash.html");
});
electron_1.ipcMain.on("splash-ready", async function (event) {
    splash.webContents.send("log", "Connecting to the database");
    await loadMain();
});
async function loadMain() {
    if (!mainWindow) {
        mainWindow = new electron_1.BrowserWindow({
            height: 720,
            width: 1080,
            webPreferences: {
                nodeIntegration: false,
                preload: path_1.join(__dirname, "./preload.js"),
            },
            show: false,
            darkTheme: false,
        });
        mainWindow.on("closed", function () {
            appQuit();
        });
        mainWindow.loadFile(path_1.join(__dirname, "/windows/main/index.html"));
        mainWindow.on("ready-to-show", function () {
            splash.webContents.send("log", "Loading vue.js framework");
            mainWindow.show();
        });
    }
    else {
        mainWindow.focus();
    }
}
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        appQuit();
    }
});
function appQuit() {
    electron_1.app.quit();
}
