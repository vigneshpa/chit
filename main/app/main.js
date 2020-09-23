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
const darkmode = (config_1.default.theme === "system") ? electron_1.nativeTheme.shouldUseDarkColors : (config_1.default.theme === "dark");
electron_1.nativeTheme.themeSource = darkmode ? "dark" : "light";
console.log("Darkmode:", darkmode);
electron_1.app.on("ready", async (launchInfo) => {
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
    splash.on("closed", () => {
        splash = null;
    });
    await splash.loadFile(__dirname + "/resources/splash.html");
});
electron_1.ipcMain.on("splash-ready", async (event) => {
    console.log("Splash is ready");
    splash.webContents.send("log", "Connecting to the database");
    await dbmgmt.start();
    splash.webContents.send("log", "Initialising Inter Process Communication(IPC)");
    await ipchosts.initialise();
    splash.webContents.send("log", "Loading main window");
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
                worldSafeExecuteJavaScript: true,
                contextIsolation: false
            },
            show: false,
            darkTheme: darkmode,
            backgroundColor: darkmode ? "#000000" : "#ffffff"
        });
        mainWindow.setMenu(null);
        mainWindow.on("closed", function () {
            appQuit();
        });
        mainWindow.on("ready-to-show", function () {
            splash.webContents.send("log", "UI is ready<br/>Waiting for idle signal");
            mainWindow.show();
            setTimeout(function () {
                splash === null || splash === void 0 ? void 0 : splash.close();
            }, 2000);
        });
        splash.webContents.send("log", "Executing vue.js framework");
        if (config_1.default.isDevelopement) {
            await mainWindow.loadURL("http://localhost:8000");
            mainWindow.webContents.openDevTools();
        }
        else {
            await mainWindow.loadFile(path_1.join(__dirname, "./windows/index.html"));
        }
    }
    else {
        mainWindow.focus();
    }
}
ipchosts.setOnPingRecived(() => {
    if (splash)
        splash.webContents.send("log", "Loading UI ");
});
ipchosts.setOnOpenForm(async (type) => {
    if (!formsWindow) {
        console.log("Recived message from renderer to open ", type);
        formsWindow = new electron_1.BrowserWindow({
            height: 400,
            width: 550,
            parent: mainWindow,
            webPreferences: {
                nodeIntegration: false,
                preload: path_1.join(__dirname, "./preload.js")
            },
            resizable: true,
            darkTheme: darkmode,
            backgroundColor: darkmode ? "#000000" : "#ffffff"
        });
        formsWindow.setMenu(null);
        formsWindow.on("closed", function () {
            formsWindow = null;
        });
        if (config_1.default.isDevelopement) {
            await formsWindow.loadURL("http://localhost:8000/forms.html?form=" + type);
            formsWindow.webContents.openDevTools();
        }
        else {
            await formsWindow.loadFile(path_1.join(__dirname, "./windows/forms.html"), { query: { "form": type } });
        }
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
    try {
        await dbmgmt.closeDB();
    }
    catch (e) {
        console.log(e);
    }
    electron_1.app.quit();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0FBQ3RFLHFDQUE4QjtBQUU5QixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDeEMsdUNBQW9FO0FBQ3BFLCtCQUE0QjtBQUM1QixxQ0FBOEI7QUFDOUIsdUNBQWlDO0FBQ2pDLE1BQU0sTUFBTSxHQUFXLFdBQUksQ0FBQyxjQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sTUFBTSxHQUFXLElBQUksZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxNQUFNLFFBQVEsR0FBYSxJQUFJLGlCQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFaEQsSUFBSSxNQUFxQixDQUFDO0FBQzFCLElBQUksVUFBeUIsQ0FBQztBQUM5QixJQUFJLFdBQTBCLENBQUM7QUFFL0IsTUFBTSxRQUFRLEdBQUcsQ0FBQyxnQkFBTSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBTSxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQztBQUMzRyxzQkFBVyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUEsQ0FBQyxDQUFBLE1BQU0sQ0FBQSxDQUFDLENBQUEsT0FBTyxDQUFDO0FBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRW5DLGNBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxVQUFVLEVBQUMsRUFBRTtJQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLHlCQUF5QixDQUFDLENBQUM7SUFDM0QsTUFB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