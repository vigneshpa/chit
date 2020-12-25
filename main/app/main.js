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
ipchosts.on("getPath", (name) => electron_1.app.getPath(name));
ipchosts.on("appQuit", () => electron_1.app.quit());
ipchosts.on("showMessageBox", (options) => electron_1.dialog.showMessageBox(options));
ipchosts.on("showOpenDialog", (options) => electron_1.dialog.showOpenDialog(options));
ipchosts.on("openExternal", (url) => electron_1.shell.openExternal(url));
ipchosts.on("pingRecived", () => {
    if (splash)
        splash === null || splash === void 0 ? void 0 : splash.webContents.send("log", "Loading UI ");
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
            await formsWindow.loadFile(path_1.join(__dirname, "./windows/forms.html"), { query: { "form": type, ...args } });
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
            await mainWindow.loadFile(path_1.join(__dirname, "./windows/index.html"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEVBQThFLENBQUMsQ0FBQztBQUM1RixPQUFPLENBQUMsR0FBRyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7QUFDNUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO0FBQzVGLE9BQU8sQ0FBQyxHQUFHLENBQUM7Ozs7Ozs7Ozs7Ozs7d0VBYTRELENBQUMsQ0FBQztBQUMxRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRXBCLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDN0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxpREFBaUQsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZGLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDLENBQUM7QUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7QUFDdEUscUNBQThCO0FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN4Qyx1Q0FBeUg7QUFDekgsdURBQStDO0FBQy9DLCtCQUE0QjtBQUM1QixxQ0FBOEI7QUFDOUIsdUNBQWlDO0FBRWpDLE1BQU0sTUFBTSxHQUFXLE9BQUEsZ0JBQU0sQ0FBQyxZQUFZLDBDQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFJLENBQUMsY0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNoSSxNQUFNLE1BQU0sR0FBVyxJQUFJLGdCQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUMsTUFBTSxRQUFRLEdBQWEsSUFBSSxpQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELElBQUksQ0FBQyxnQkFBTSxDQUFDLFlBQVk7SUFBRSxnQkFBTSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDbkQsZ0JBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUV0QyxJQUFJLE1BQXFCLENBQUM7QUFDMUIsSUFBSSxVQUF5QixDQUFDO0FBQzlCLElBQUksV0FBMEIsQ0FBQztBQUMvQixJQUFJLFFBQWlCLENBQUM7QUFFdEIsSUFBSSxnQkFBTSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7SUFDN0IsUUFBUSxHQUFHLHNCQUFXLENBQUMsbUJBQW1CLENBQUM7Q0FFNUM7S0FBTTtJQUNMLFFBQVEsR0FBRyxDQUFDLGdCQUFNLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDO0NBRXRDO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFbkMsY0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLFVBQVUsRUFBQyxFQUFFO0lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNoQyxNQUFNLE1BQU0sRUFBRSxDQUFDO0lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDekIsS0FBSyxFQUFFLEdBQUc7UUFDVixNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNkLGVBQWUsRUFBRSxJQUFJO1NBQ3RCO1FBQ0QsS0FBSyxFQUFFLEtBQUs7UUFDWixTQUFTLEVBQUUsS0FBSztRQUNoQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsS0FBSztLQUNuQixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDdkIsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsd0JBQXdCLENBQUMsQ0FBQztBQUM5RCxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxjQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDcEQsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsY0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDekMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFFLE9BQTBCLEVBQUUsRUFBRSxDQUFDLGlCQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDL0YsUUFBUSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFFLE9BQTBCLEVBQUUsRUFBRSxDQUFDLGlCQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDL0YsUUFBUSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFVLEVBQUMsRUFBRSxDQUFBLGdCQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzlCLElBQUksTUFBTTtRQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7QUFDN0QsQ0FBQyxDQUFDLENBQUM7QUFDSCxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQStCLEVBQUUsRUFBRTtJQUN0RSxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsV0FBVyxHQUFHLElBQUksd0JBQWEsQ0FBQztZQUM5QixNQUFNLEVBQUUsR0FBRztZQUNYLEtBQUssRUFBRSxHQUFHO1lBQ1YsY0FBYyxFQUFFO2dCQUNkLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixPQUFPLEVBQUUsV0FBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUM7YUFDekM7WUFDRCxTQUFTLEVBQUUsSUFBSTtZQUNmLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUztTQUNsRCxDQUFDLENBQUM7UUFDSCxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLFdBQVcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQ3ZCLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLGdCQUFNLENBQUMsY0FBYyxFQUFFO1lBQ3pCLElBQUksWUFBWSxHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLENBQUM7WUFDbEUsTUFBTSxXQUFXLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3pGLFdBQVcsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDeEM7YUFBTTtZQUNMLE1BQU0sV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFJLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzNHO0tBQ0Y7U0FBTTtRQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLEVBQUUsSUFBSSxFQUFFLHNDQUFzQyxDQUFDLENBQUM7UUFDcEcsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3JCO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFDLEtBQUssRUFBQyxFQUFFO0lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMvQixNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsNEJBQTRCLEVBQUU7SUFDOUQsSUFBSSxDQUFDLENBQUMsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRTtRQUM3QixJQUFJLEdBQUcsR0FBRyxNQUFNLGlCQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxnQkFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzNFLE9BQU8sRUFBRSw4RkFBOEYsZ0JBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxxQ0FBcUM7WUFDeEssSUFBSSxFQUFFLFVBQVU7WUFDaEIsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztZQUN0QixRQUFRLEVBQUUsQ0FBQztTQUNaLENBQUMsQ0FBQyxDQUFDO1lBQ0EsT0FBTyxFQUNMLDRFQUE0RSxNQUFNLEVBQUU7WUFDdEYsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDZixRQUFRLEVBQUUsQ0FBQztTQUNaLENBQUMsQ0FBQztRQUNMLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUU7WUFDdEIsTUFBTSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDekI7YUFBTTtZQUNMLGNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNYLE9BQU87U0FDUjtLQUNGO0lBQ0QsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLCtDQUErQyxFQUFFO0lBQ2pGLE1BQU0sUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzVCLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRTtJQUN2RCxNQUFNLFFBQVEsRUFBRSxDQUFDO0FBQ25CLENBQUMsQ0FBQyxDQUFDO0FBRUgsS0FBSyxVQUFVLE1BQU07SUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQzFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxFQUFFO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQztRQUM1RCxPQUFPO0tBQ1I7SUFDRCw4QkFBVyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtRQUNsQyxpQkFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsT0FBTyxFQUFFLCtEQUErRCxFQUFFLENBQUMsQ0FBQztRQUN4RyxVQUFVLENBQUM7WUFDVCw4QkFBVyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQy9CLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ0gsOEJBQVcsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUU7UUFDakMsSUFBSSxpQkFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsT0FBTyxFQUFFLG1GQUFtRixFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdKLDhCQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDOUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILElBQUk7UUFDRixNQUFNLDhCQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDckM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDO0FBQ0QsS0FBSyxVQUFVLFFBQVE7SUFDckIsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLFVBQVUsR0FBRyxJQUFJLHdCQUFhLENBQUM7WUFDN0IsTUFBTSxFQUFFLEdBQUc7WUFDWCxLQUFLLEVBQUUsSUFBSTtZQUNYLGNBQWMsRUFBRTtnQkFDZCxlQUFlLEVBQUUsS0FBSztnQkFDdEIsT0FBTyxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDO2dCQUN4QywwQkFBMEIsRUFBRSxJQUFJO2dCQUNoQyxnQkFBZ0IsRUFBRSxLQUFLO2FBQ3hCO1lBQ0QsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUUsUUFBUTtZQUNuQixlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDbEQsQ0FBQyxDQUFDO1FBQ0gsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUN0QixjQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFO1lBQzdCLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSx5Q0FBeUMsRUFBRTtZQUMzRSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEIsVUFBVSxDQUFDO2dCQUNULE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxLQUFLLEdBQUc7WUFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsNEJBQTRCLEVBQUU7UUFDOUQsSUFBSSxnQkFBTSxDQUFDLGNBQWMsRUFBRTtZQUN6QixNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNsRCxVQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3ZDO2FBQU07WUFDTCxNQUFNLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBSSxDQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7U0FDcEU7S0FDRjtTQUFNO1FBQ0wsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3BCO0FBQ0gsQ0FBQztBQU9ELElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztBQUMxQixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDekIsY0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxXQUFXLEVBQUU7SUFDdEMsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUNqQixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDckI7U0FBTTtRQUNMLE9BQU87S0FDUjtJQUNELElBQUksYUFBYTtRQUFFLE9BQU87SUFDMUIsYUFBYSxHQUFHLElBQUksQ0FBQztJQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDbEQsSUFBSTtRQUNGLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3hCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0lBQ0QsWUFBWSxHQUFHLElBQUksQ0FBQztJQUNwQixjQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDYixDQUFDLENBQUMsQ0FBQyJ9