"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Promise Rejection at:', p, 'reason:', reason);
    process.exit(1);
});
console.log("Loading configurations and environment variables . . .");
const config_1 = require("./config");
console.log("Starting Electron . . . ");
const electron_1 = require("electron");
const electron_updater_1 = require("electron-updater");
const path_1 = require("path");
const Dbmgmt_1 = require("./Dbmgmt");
const Ipchost_1 = require("./Ipchost");
const dbFile = ((_a = config_1.default.databaseFile) === null || _a === void 0 ? void 0 : _a.isCustom) ? config_1.default.databaseFile.location : path_1.join(electron_1.app.getPath("userData"), "/main.db");
const dbmgmt = new Dbmgmt_1.default(dbFile);
const ipchosts = new Ipchost_1.default(dbmgmt);
if (!config_1.default.databaseFile)
    config_1.default.databaseFile = {};
config_1.default.databaseFile.location = dbFile;
let splash;
let mainWindow;
let formsWindow;
let darkmode;
if (config_1.default.theme === "system") {
    darkmode = electron_1.nativeTheme.shouldUseDarkColors;
}
else {
    darkmode = (config_1.default.theme === "dark");
}
console.log("Darkmode:", darkmode);
electron_1.app.on("ready", async (launchInfo) => {
    console.log("Got ready signal");
    await update();
    console.log("Displaying splash . . .");
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
    if (!(await dbmgmt.connect())) {
        let res = await electron_1.dialog.showMessageBox(splash, config_1.default.databaseFile.isCustom ? {
            message: `Looks like you have configured custom database file.\nChit cannot find a database file at\n${config_1.default.databaseFile.location}\nDo you wish to create a new one ?`,
            type: "question",
            buttons: ["Yes", "No"],
            cancelId: 1
        } : {
            message: `Looks like you are running Chit for first time.\nData will be stored at\n${dbFile}`,
            type: "info",
            buttons: ["OK"],
            cancelId: 0
        });
        if (res.response === 0) {
            await dbmgmt.createDB();
        }
        else {
            electron_1.app.quit();
            return;
        }
    }
    splash.webContents.send("log", "Initialising Inter Process Communication(IPC)");
    await ipchosts.initialise();
    splash.webContents.send("log", "Loading main window");
    await loadMain();
});
async function update() {
    console.log("checking for updates . . .");
    if (process.env.NODE_ENV !== "production") {
        console.log("Running in developement mode skipping update");
        return;
    }
    electron_updater_1.autoUpdater.on("update-downloaded", function () {
        electron_1.dialog.showMessageBoxSync({ message: "An update is downloaded.\nThe app will restart in 10 seconds." });
        setTimeout(function () {
            electron_updater_1.autoUpdater.quitAndInstall();
        }, 10000);
    });
    electron_updater_1.autoUpdater.on("update-available", function () {
        if (electron_1.dialog.showMessageBoxSync({ message: "Do you want to download the update\nApp needs to be restarted after installation.", buttons: ["Yes", "No"] }) === 0) {
            electron_updater_1.autoUpdater.downloadUpdate();
        }
    });
    try {
        await electron_updater_1.autoUpdater.checkForUpdates();
    }
    catch (e) {
        console.log(e);
    }
}
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
            electron_1.app.quit();
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
            await mainWindow.loadURL("http://localhost:8080");
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
ipchosts.setOnOpenForm(async (type, args) => {
    if (!formsWindow) {
        console.log("Recived message from renderer to open ", type);
        formsWindow = new electron_1.BrowserWindow({
            height: 400,
            width: 550,
            webPreferences: {
                nodeIntegration: false,
                preload: path_1.join(__dirname, "./preload.js")
            },
            resizable: true,
            minimizable: false,
            darkTheme: darkmode,
            backgroundColor: darkmode ? "#000000" : "#ffffff"
        });
        formsWindow.setMenu(null);
        formsWindow.on("closed", function () {
            formsWindow = null;
        });
        if (config_1.default.isDevelopement) {
            let searchParams = new URLSearchParams({ "form": type, ...args });
            await formsWindow.loadURL("http://localhost:8080/forms.html?" + searchParams.toString());
            formsWindow.webContents.openDevTools();
        }
        else {
            await formsWindow.loadFile(path_1.join(__dirname, "./windows/forms.html"), { query: { "form": type, ...args } });
        }
    }
    else {
        console.log("Recived message from renderer to open ", type, "But it already exists.Focusing that.");
        formsWindow.focus();
    }
});
var isAppQuitting = false;
var doneQuitting = false;
electron_1.app.on("before-quit", async function (ev) {
    if (!doneQuitting) {
        ev.preventDefault();
    }
    else {
        return;
    }
    if (isAppQuitting)
        return;
    isAppQuitting = true;
    console.log("Closing database connections . . .");
    try {
        await dbmgmt.closeDB();
    }
    catch (e) {
        console.log(e);
    }
    doneQuitting = true;
    electron_1.app.quit();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDN0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQ3RFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDakIsQ0FBQyxDQUFDLENBQUM7QUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7QUFDdEUscUNBQThCO0FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN4Qyx1Q0FBNEU7QUFDNUUsdURBQStDO0FBQy9DLCtCQUE0QjtBQUM1QixxQ0FBOEI7QUFDOUIsdUNBQWlDO0FBRWpDLE1BQU0sTUFBTSxHQUFXLE9BQUEsZ0JBQU0sQ0FBQyxZQUFZLDBDQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFJLENBQUMsY0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoSSxNQUFNLE1BQU0sR0FBVyxJQUFJLGdCQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUMsTUFBTSxRQUFRLEdBQWEsSUFBSSxpQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELElBQUksQ0FBQyxnQkFBTSxDQUFDLFlBQVk7SUFBRSxnQkFBTSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDbkQsZ0JBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUV0QyxJQUFJLE1BQXFCLENBQUM7QUFDMUIsSUFBSSxVQUF5QixDQUFDO0FB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