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
  //process.exit(1);
});
console.log("Loading configurations and environment variables . . .");
import config from "./config";
console.log("Starting Electron . . . ");
import { BrowserWindow, app, ipcMain, nativeTheme, dialog, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { join } from "path";
import { writeFile } from "fs";





import { Dbmgmt, Ipchost } from "chitcore";
import IpciMain from "./IpciMain";


const dbFile: string = config.databaseFile?.isCustom ? config.databaseFile.location : join(app.getPath("userData"), "/main.db");
const dbmgmt: Dbmgmt = new Dbmgmt({ type: "sqlite", database: dbFile });
const ipciMain = new IpciMain(ipcMain);


//Hot reloading

if (config.isDevelopement) {
  require('electron-reload')([__dirname, `${__dirname}/${config.vueApp}`]);
}


//Platform Functions
const pf: pfPromisified = {
  showMessageBox: async (options) => { return (await dialog.showMessageBox(options)).response },
  showOpenDialog: (options) => dialog.showOpenDialog(options),
  openExternal: (url) => shell.openExternal(url),
  ping: async () => {
    if (splash) splash?.webContents.send("log", "Loading UI ");
  },
  updateConfig: (newConfig) => {
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
        resoleve();
      });
    });
  }
};
const ipchosts: Ipchost = new Ipchost(ipciMain, dbmgmt, pf, global.config);
if (!config.databaseFile) config.databaseFile = {};
config.databaseFile.location = dbFile;

let splash: BrowserWindow;
let mainWindow: BrowserWindow;
let darkmode: boolean;

if (config.theme === "system") {
  darkmode = nativeTheme.shouldUseDarkColors;
  //nativeTheme.themeSource = "system";
} else {
  darkmode = (config.theme === "dark");
  //nativeTheme.themeSource = config.theme;
}
console.log("Darkmode:", darkmode);


//On ready
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
  await splash.loadFile(join(__dirname, "resources/splash.html"));
});

ipcMain.on("splash-ready", async _event => {
  if (splash?.isDestroyed()) return;
  console.log("Splash is ready");
  splash?.webContents.send("log", "Connecting to the database");
  await dbmgmt.connect()
  splash?.webContents.send("log", "Initialising Inter Process Communication(IPC)");
  ipchosts.init();
  splash?.webContents.send("log", "Loading main window");
  await loadMain();
});

ipcMain.handle("getConfig", ev => {
  return config;
})

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
    await mainWindow.loadFile(`${__dirname}/${config.vueApp}/index.html`);
    if (config.isDevelopement) mainWindow.webContents.openDevTools();
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
    await dbmgmt.close();
  } catch (e) {
    console.log(e);
  }
  doneQuitting = true;
  app.quit();
});