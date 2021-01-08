"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This file communicates with electron api
 */
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
const ChitORM_1 = require("../../chit-common/node_modules/chitorm/lib/ChitORM");
const dbFile = ((_a = config_1.default.databaseFile) === null || _a === void 0 ? void 0 : _a.isCustom) ? config_1.default.databaseFile.location : path_1.join(electron_1.app.getPath("userData"), "/main.db");
const chitORM = new ChitORM_1.default({ type: "sqlite", file: dbFile });
const dbmgmt = new chit_common_1.Dbmgmt(chitORM);
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
    //nativeTheme.themeSource = "system";
}
else {
    darkmode = (config_1.default.theme === "dark");
    //nativeTheme.themeSource = config.theme;
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
ipchosts.on("updateConfig", (newConfig) => {
    return new Promise((resoleve, rejects) => {
        fs_1.writeFile(newConfig.configPath, JSON.stringify(newConfig), async (err) => {
            if (err) {
                rejects(err);
            }
            ;
            if (!newConfig.databaseFile.isCustom)
                newConfig.databaseFile.location = path_1.join(electron_1.app.getPath("userData"), "./main.db");
            //console.log(global.config.databaseFile.location, newConfig.databaseFile.location);
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
            //await new Promise(r => setTimeout(r, 5000));
            resoleve(true);
        });
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
electron_1.ipcMain.on("splash-ready", async (_event) => {
    console.log("Splash is ready");
    splash === null || splash === void 0 ? void 0 : splash.webContents.send("log", "Connecting to the database");
    await dbmgmt.connect();
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
/*app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    appQuit();
  }
});*/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOztHQUVHO0FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO0FBQzVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEVBQThFLENBQUMsQ0FBQztBQUM1RixPQUFPLENBQUMsR0FBRyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7QUFDNUYsT0FBTyxDQUFDLEdBQUcsQ0FBQzs7Ozs7Ozs7Ozs7Ozt3RUFhNEQsQ0FBQyxDQUFDO0FBQzFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFcEIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUM3QyxPQUFPLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkYsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQztBQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUMsQ0FBQztBQUN0RSxxQ0FBOEI7QUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3hDLHVDQUF5SDtBQUN6SCx1REFBK0M7QUFDL0MsK0JBQTRCO0FBQzVCLDZDQUFxQztBQUNyQyw2Q0FBc0M7QUFDdEMsMkJBQStCO0FBQy9CLGdGQUF5RTtBQUN6RSxNQUFNLE1BQU0sR0FBVyxPQUFBLGdCQUFNLENBQUMsWUFBWSwwQ0FBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLGdCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBSSxDQUFDLGNBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFD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