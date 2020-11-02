process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason)
  process.exit(1)
});
console.log("Loading configurations and environment variables . . .");
import config from "./config";

console.log("checking for updates . . .");
import { autoUpdater } from "electron-updater";
if(process.env.NODE_ENV === "production"){
autoUpdater.on("update-downloaded", function(){
  dialog.showMessageBoxSync({message:"An update is downloaded.\nThe app will restart in 10 seconds."});
  setTimeout(function(){
    autoUpdater.quitAndInstall();
  }, 10000)
});
autoUpdater.on("update-available", function(){
  if(dialog.showMessageBoxSync({message:"Do you want to download the update", buttons:["Yes", "No"]}) === 0){
    autoUpdater.downloadUpdate();
  }
})
autoUpdater.checkForUpdates();
}

console.log("Starting Electron . . . ");
import { BrowserWindow, app, ipcMain, nativeTheme, dialog } from "electron";
import { join } from "path";
import Dbmgmt from "./Dbmgmt";
import Ipchosts from "./Ipchost";
const dbFile: string = config.databaseFile?.isCustom ? config.databaseFile.location : join(app.getPath("userData"), "/main.db");
const dbmgmt: Dbmgmt = new Dbmgmt(dbFile);
const ipchosts: Ipchosts = new Ipchosts(dbmgmt);
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
  console.log("Got ready signal", "Displaying splash . . .");
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

ipcMain.on("splash-ready", async event => {
  console.log("Splash is ready");
  splash.webContents.send("log", "Connecting to the database");
  if (!(await dbmgmt.connect())) {
    let res = await dialog.showMessageBox(splash, config.databaseFile.isCustom ? {
      message: `Looks like you have configured custom database file.\nChit cannot find a database file at\n${config.databaseFile.location}\nDo you wish to create a new one ?`,
      type: "question",
      buttons: ["Yes", "No"],
      cancelId: 1
    } : {
        message:
          `Looks like you are running Chit for first time.\nData will be stored at\n${dbFile}`,
        type: "info",
        buttons: ["OK"],
        cancelId: 0
      });
    if (res.response === 0) {
      await dbmgmt.createDB();
    } else {
      app.quit();
      return;
    }
  }
  splash.webContents.send("log", "Initialising Inter Process Communication(IPC)");
  await ipchosts.initialise();
  splash.webContents.send("log", "Loading main window");
  await loadMain();
});

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
      splash.webContents.send("log", "UI is ready<br/>Waiting for idle signal");
      mainWindow.show();
      setTimeout(function () {
        splash?.close();
      }, 2000);
    });
    splash.webContents.send("log", "Executing vue.js framework");
    if (config.isDevelopement) {
      await mainWindow.loadURL("http://localhost:8080");
      mainWindow.webContents.openDevTools();
    } else {
      await mainWindow.loadFile(join(__dirname, "./windows/index.html"));
    }
  } else {
    mainWindow.focus();
  }
}

ipchosts.setOnPingRecived(() => {
  if (splash) splash.webContents.send("log", "Loading UI ");
});
ipchosts.setOnOpenForm(async type => {
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
      await formsWindow.loadURL("http://localhost:8080/forms.html?form=" + type);
      formsWindow.webContents.openDevTools();
    } else {
      await formsWindow.loadFile(join(__dirname, "./windows/forms.html"), { query: { "form": type } });
    }
  } else {
    console.log("Recived message from renderer to open ", type, "But it already exists.Focusing that.");
    formsWindow.focus();
  }
});

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