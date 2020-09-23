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
electron_1.app.on("ready", function (launchInfo) {
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
    splash.loadFile(__dirname + "/resources/splash.html");
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
function loadMain() {
    if (!mainWindow) {
        mainWindow = new electron_1.BrowserWindow({
            height: 720,
            width: 1080,
            webPreferences: {
                nodeIntegration: false,
                preload: path_1.join(__dirname, "./preload.js")
            },
            show: false,
            backgroundColor: (config_1.default.theme === "light") ? "#ffffff" : "#000000"
        });
        mainWindow.on("closed", function () {
            appQuit();
        });
        splash.webContents.send("log", "Executing vue.js framework");
        if (config_1.default.isDevelopement) {
            mainWindow.loadURL("http://localhost:8000");
            mainWindow.webContents.openDevTools();
        }
        else {
            mainWindow.loadFile(path_1.join(__dirname, "./windows/index.html"));
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
ipchosts.setOnOpenForm(function (type) {
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
            formsWindow.loadURL("http://localhost:8000/forms.html?form=" + type);
            formsWindow.webContents.openDevTools();
        }
        else {
            formsWindow.loadURL("file:///" + path_1.join(__dirname, "./windows/forms.html") + "?form=" + type);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0FBQ3RFLHFDQUE4QjtBQUU5QixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDeEMsdUNBQXVEO0FBQ3ZELCtCQUE0QjtBQUM1QixxQ0FBOEI7QUFDOUIsdUNBQWlDO0FBQ2pDLE1BQU0sTUFBTSxHQUFXLFdBQUksQ0FBQyxjQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sTUFBTSxHQUFXLElBQUksZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxNQUFNLFFBQVEsR0FBYSxJQUFJLGlCQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFaEQsSUFBSSxNQUFxQixDQUFDO0FBQzFCLElBQUksVUFBeUIsQ0FBQztBQUM5QixJQUFJLFdBQTBCLENBQUM7QUFFL0IsY0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxVQUFVO0lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUseUJBQXlCLENBQUMsQ0FBQztJQUMzRCxNQUFNLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxHQUFHO1FBQ1YsTUFBTSxFQUFFLEdBQUc7UUFDWCxjQUFjLEVBQUU7WUFDZCxlQUFlLEVBQUUsSUFBSTtTQUN0QjtRQUNELEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxFQUFFLEtBQUs7UUFDaEIsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLEtBQUs7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsd0JBQXdCLENBQUMsQ0FBQztJQUN0RCxNQUFNLENB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