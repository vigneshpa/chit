"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
console.log("////////////////////////////////////////////////////////////////////////////");
console.log("///////////////|     Chit Management System        |////////////////////////");
console.log("////////////////////////////////////////////////////////////////////////////");
console.log(`   ​Copyright (C) 2020  Vignesh Paranthaman<vignesh-p@outlook.com>

​This program is free software: you can redistribute it and/or modify
​it under the terms of the GNU General Public License as published by
​the  Free  Software  Foundation, either version 3 of the License, or
any later version.

​This program is distributed in the hope that it will be useful,
​but WITHOUT ANY WARRANTY; without even the implied warranty of
​MERCHANTABILITY or  FITNESS FOR A PARTICULAR PURPOSE.  See the
​GNU General Public License for more details.

​You should have received a copy of the GNU General Public License
​along with this program.  If not, see <https://www.gnu.org/licenses/>.`);
console.log("\n\n");
process.on('unhandledRejection', (reason, p) => {
    console.error('\n\nAPP CRASH:\nUnhandled Promise Rejection at:', p, 'reason:', reason);
    process.exit(1);
});
console.log("Loading configurations and environment variables . . .");
const config_1 = require("./config");
console.log("Starting Electron . . . ");
const electron_1 = require("electron");
const electron_updater_1 = require("electron-updater");
const path_1 = require("path");
const chit_common_1 = require("chit-common");
const chit_common_2 = require("chit-common");
const fs_1 = require("fs");
const sqlite3_1 = require("./sqlite3");
const dbFile = ((_a = config_1.default.databaseFile) === null || _a === void 0 ? void 0 : _a.isCustom) ? config_1.default.databaseFile.location : path_1.join(electron_1.app.getPath("userData"), "/main.db");
const chitDB = new sqlite3_1.default();
const dbmgmt = new chit_common_1.Dbmgmt(dbFile, chitDB);
const ipchosts = new chit_common_2.Ipchost(electron_1.ipcMain, dbmgmt, global.config);
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
ipchosts.on("showMessageBox", (options) => electron_1.dialog.showMessageBox(options));
ipchosts.on("showOpenDialog", (options) => electron_1.dialog.showOpenDialog(options));
ipchosts.on("openExternal", (url) => electron_1.shell.openExternal(url));
ipchosts.on("pingRecived", () => {
    if (splash)
        splash === null || splash === void 0 ? void 0 : splash.webContents.send("log", "Loading UI ");
});
ipchosts.on("updateConfig", (newConfig, cb) => {
    fs_1.writeFile(newConfig.configPath, JSON.stringify(newConfig), async (err) => {
        if (err) {
            cb(err, false);
            throw err;
        }
        ;
        if (!newConfig.databaseFile.isCustom)
            newConfig.databaseFile.location = path_1.join(electron_1.app.getPath("userData"), "./main.db");
        if (global.config.databaseFile.location !== newConfig.databaseFile.location) {
            electron_1.dialog.showMessageBox({
                message: "Looks like you have changed the database file. The app must restart to use the new database. The app will restart in 10 seconds",
                title: "Database file changed"
            });
            setTimeout(() => {
                electron_1.app.quit();
            }, 10000);
        }
        global.config = newConfig;
        cb(null, true);
    });
});
ipchosts.on("openForm", async (type, args) => {
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
            await formsWindow.loadFile(path_1.join(__dirname, config_1.default.vueApp, "/forms.html"), { query: { "form": type, ...args } });
        }
    }
    else {
        console.log("Recived message from renderer to open ", type, "But it already exists.Focusing that.");
        formsWindow.focus();
    }
});
electron_1.ipcMain.on("splash-ready", async (event) => {
    console.log("Splash is ready");
    splash === null || splash === void 0 ? void 0 : splash.webContents.send("log", "Connecting to the database");
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
    splash === null || splash === void 0 ? void 0 : splash.webContents.send("log", "Initialising Inter Process Communication(IPC)");
    await ipchosts.initialise();
    splash === null || splash === void 0 ? void 0 : splash.webContents.send("log", "Loading main window");
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
            splash === null || splash === void 0 ? void 0 : splash.webContents.send("log", "UI is ready<br/>Waiting for idle signal");
            mainWindow.show();
            setTimeout(function () {
                splash === null || splash === void 0 ? void 0 : splash.close();
            }, 2000);
        });
        splash === null || splash === void 0 ? void 0 : splash.webContents.send("log", "Executing vue.js framework");
        if (config_1.default.isDevelopement) {
            await mainWindow.loadURL("http://localhost:8080");
            mainWindow.webContents.openDevTools();
        }
        else {
            await mainWindow.loadFile(path_1.join(__dirname, config_1.default.vueApp, "/index.html"));
        }
    }
    else {
        mainWindow.focus();
    }
}
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
