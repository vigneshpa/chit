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
import config from "./config";
console.log("Starting Electron . . . ");
import { BrowserWindow, app, ipcMain, nativeTheme, dialog, MessageBoxOptions, OpenDialogOptions, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { join } from "path";
import { Dbmgmt } from "chit-common";
import { Ipchost } from "chit-common";
import { writeFile } from "fs";
import { ChitORM } from "chit-common";
const dbFile: string = config.databaseFile?.isCustom ? config.databaseFile.location : join(app.getPath("userData"), "/main.db");
const chitORM = new ChitORM({ type: "sqlite", file: dbFile });
const dbmgmt: Dbmgmt = new Dbmgmt(chitORM);
const ipchosts: Ipchost = new Ipchost(ipcMain, dbmgmt, global.config);
if (!config.databaseFile) config.databaseFile = {};
config.databaseFile.location = dbFile;

let splash: BrowserWindow;
let mainWindow: BrowserWindow;
let formsWindow: BrowserWindow;
let darkmode: boolean;

if (config.theme === "system") {
  darkmode = nativeTheme.shouldUseDarkColors;
  //nativeTheme.themeSource = "system";
} else {
  darkmode = (config.theme === "dark");
  //nativeTheme.themeSource = config.theme;
}
console.log("Darkmode:", darkmode);

app.on("ready", async launchInfo => {
  console.log("Got ready signal");
  await update();
  console.log("Displaying splash . . .");
  splash = new BrowserWindow({
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

ipchosts.on("showMessageBox", (options) => dialog.showMessageBox(options));
ipchosts.on("showOpenDialog", (options) => dialog.showOpenDialog(options));
ipchosts.on("openExternal", (url) => shell.openExternal(url));
ipchosts.on("pingRecived", () => {
  if (splash) splash?.webContents.send("log", "Loading UI ");
});
ipchosts.on("updateConfig", (newConfig) => {
  return new Promise((resoleve, rejects) => {
    writeFile(newConfig.configPath, JSON.stringify(newConfig), async err => {
      if (err) {
        rejects(err);
      };
      if (!newConfig.databaseFile.isCustom) newConfig.databaseFile.location = join(app.getPath("userData"), "./main.db");
      //console.log(global.config.databaseFile.location, newConfig.databaseFile.location);
      if (global.config.databaseFile.location !== newConfig.databaseFile.location) {
        dialog.showMessageBox({
          message: "Looks like you have changed the database file. The app must restart to use the new database. The app will restart in 10 seconds",
          title: "Database file changed"
        });
        setTimeout(() => {
          app.quit();
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
    formsWindow = new BrowserWindow({
      height: 400,
      width: 550,
      webPreferences: {
        nodeIntegration: false,
        preload: join(__dirname, "./preload.js")
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
    if (config.isDevelopement) {
      let searchParams = new URLSearchParams({ "form": type, ...args });
      await formsWindow.loadURL("http://localhost:8080/forms.html?" + searchParams.toString());
      formsWindow.webContents.openDevTools();
    } else {
      await formsWindow.loadFile(join(__dirname, config.vueApp, "/forms.html"), { query: { "form": type, ...args } });
    }
  } else {
    console.log("Recived message from renderer to open ", type, "But it already exists.Focusing that.");
    formsWindow.focus();
  }
});

ipcMain.on("splash-ready", async _event => {
  console.log("Splash is ready");
  splash?.webContents.send("log", "Connecting to the database");
  await dbmgmt.connect()
  splash?.webContents.send("log", "Initialising Inter Process Communication(IPC)");
  await ipchosts.initialise();
  splash?.webContents.send("log", "Loading main window");
  await loadMain();
});

async function update() {
  console.log("checking for updates . . .");
  if (process.env.NODE_ENV !== "production") {
    console.log("Running in developement mode skipping update");
    return;
  }
  autoUpdater.on("update-downloaded", function () {
    dialog.showMessageBoxSync({ message: "An update is downloaded.\nThe app will restart in 10 seconds." });
    setTimeout(function () {
      autoUpdater.quitAndInstall();
    }, 10000)
  });
  autoUpdater.on("update-available", function () {
    if (dialog.showMessageBoxSync({ message: "Do you want to download the update\nApp needs to be restarted after installation.", buttons: ["Yes", "No"] }) === 0) {
      autoUpdater.downloadUpdate();
    }
  });
  try {
    await autoUpdater.checkForUpdates();
  } catch (e) {
    console.log(e);
  }
}
async function loadMain() {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      height: 720,
      width: 1080,
      webPreferences: {
        nodeIntegration: false,
        preload: join(__dirname, "./preload.js"),
        worldSafeExecuteJavaScript: true,
        contextIsolation: false
      },
      show: false,
      darkTheme: darkmode,
      backgroundColor: darkmode ? "#000000" : "#ffffff"
    });
    mainWindow.setMenu(null);
    mainWindow.on("closed", function () {
      app.quit();
    });
    mainWindow.on("ready-to-show", function () {
      splash?.webContents.send("log", "UI is ready<br/>Waiting for idle signal");
      mainWindow.show();
      setTimeout(function () {
        splash?.close();
      }, 2000);
    });
    splash?.webContents.send("log", "Executing vue.js framework");
    if (config.isDevelopement) {
      await mainWindow.loadURL("http://localhost:8080");
      mainWindow.webContents.openDevTools();
    } else {
      await mainWindow.loadFile(join(__dirname, config.vueApp, "/index.html"));
    }
  } else {
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
app.on("before-quit", async function (ev) {
  if (!doneQuitting) {
    ev.preventDefault();
  } else {
    return;
  }
  if (isAppQuitting) return;
  isAppQuitting = true;
  console.log("Closing database connections . . .");
  try {
    await dbmgmt.closeDB();
  } catch (e) {
    console.log(e);
  }
  doneQuitting = true;
  app.quit();
});