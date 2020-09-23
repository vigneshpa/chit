"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Loading configurations and environment variables . . .");
const config_1 = require("./config");
console.log("Starting Electron . . . ");
const electron_1 = require("electron");
const path_1 = require("path");
const Dbmgmt_1 = require("./Dbmgmt");
const Ipchost_1 = require("./Ipchost");
const dbFile = path_1.join(electron_1.app.getPath("userData"), "/main.db");
const dbmgmt = new Dbmgmt_1.default(dbFile);
const ipchosts = new Ipchost_1.default(dbmgmt);
let splash;
let mainWindow;
let formsWindow;
electron_1.app.on("ready", async function (launchInfo) {
    console.log("Got ready signal", "Displaying splash . . .");
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
    await splash.loadFile(__dirname + "/resources/splash.html");
    splash.on("closed", function () {
        splash = null;
    });
});
electron_1.ipcMain.on("splash-ready", async function (event) {
    console.log("Splash is ready");
    splash.webContents.send("log", "Connecting to the database");
    dbmgmt.start();
    splash.webContents.send("log", "Initialising Inter Process Communication(IPC)");
    const ipc = await Promise.resolve().then(() => require("./Ipchost"));
    ipchosts.setOnPingRecived(() => {
        if (splash)
            splash.webContents.send("log", "Loading UI ");
    });
    ipchosts.initialise();
    splash.webContents.send("log", "Loading main window");
    loadMain();
});
async function loadMain() {
    if (!mainWindow) {
        mainWindow = new electron_1.BrowserWindow({
            height: 720,
            width: 1080,
            webPreferences: {
                nodeIntegration: false,
                preload: path_1.join(__dirname, "./preload.js"),
                worldSafeExecuteJavaScript: true,
                contextIsolation: false
            },
            show: false,
            backgroundColor: (config_1.default.theme === "light") ? "#ffffff" : "#000000"
        });
        mainWindow.on("closed", function () {
            appQuit();
        });
        splash.webContents.send("log", "Executing vue.js framework");
        if (config_1.default.isDevelopement) {
            await mainWindow.loadURL("http://localhost:8000");
            mainWindow.webContents.openDevTools();
        }
        else {
            await mainWindow.loadFile(path_1.join(__dirname, "./windows/index.html"));
        }
        mainWindow.setMenu(null);
        mainWindow.on("ready-to-show", function () {
            splash.webContents.send("log", "UI is ready<br/>Waiting for idle signal");
            mainWindow.show();
            setTimeout(function () {
                splash === null || splash === void 0 ? void 0 : splash.close();
            }, 2000);
        });
    }
    else {
        mainWindow.focus();
    }
}
ipchosts.setOnOpenForm(async function (type) {
    if (!formsWindow) {
        formsWindow = new electron_1.BrowserWindow({
            height: 400,
            width: 550,
            webPreferences: {
                nodeIntegration: false,
                preload: path_1.join(__dirname, "./preload.js")
            },
            resizable: true
        });
        formsWindow.setMenu(null);
        console.log("Recived message from renderer to open ", type);
        if (config_1.default.isDevelopement) {
            await formsWindow.loadURL("http://localhost:8000/forms.html?form=" + type);
            formsWindow.webContents.openDevTools();
        }
        else {
            await formsWindow.loadFile(path_1.join(__dirname, "./windows/forms.html"), { query: { "form": type } });
        }
        formsWindow.on("closed", function () {
            formsWindow = null;
        });
    }
    else {
        console.log("Recived message from renderer to open ", type, "But it already exists.Focusing that.");
        formsWindow.focus();
    }
});
let isAppQuitting = false;
async function appQuit() {
    if (isAppQuitting)
        return;
    isAppQuitting = true;
    await dbmgmt.closeDB();
    electron_1.app.quit();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0FBQ3RFLHFDQUE4QjtBQUU5QixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDeEMsdUNBQXVEO0FBQ3ZELCtCQUE0QjtBQUM1QixxQ0FBOEI7QUFDOUIsdUNBQWlDO0FBQ2pDLE1BQU0sTUFBTSxHQUFXLFdBQUksQ0FBQyxjQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sTUFBTSxHQUFXLElBQUksZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxNQUFNLFFBQVEsR0FBYSxJQUFJLGlCQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFaEQsSUFBSSxNQUFxQixDQUFDO0FBQzFCLElBQUksVUFBeUIsQ0FBQztBQUM5QixJQUFJLFdBQTBCLENBQUM7QUFFL0IsY0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUMsS0FBSyxXQUFXLFVBQVU7SUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBQzNELE1BQU0sR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDekIsS0FBSyxFQUFFLEdBQUc7UUFDVixNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNkLGVBQWUsRUFBRSxJQUFJO1NBQ3RCO1FBQ0QsS0FBSyxFQUFFLEtBQUs7UUFDWixTQUFTLEVBQUUsS0FBSztRQUNoQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsS0FBSztLQUNuQixDQUFDLENBQUM7SUFDSCxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLHdCQUF3QixDQUFDLENBQUM7SUFD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