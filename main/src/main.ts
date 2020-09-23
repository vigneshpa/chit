console.log("Loading configurations and environment variables . . .");
import config from "./config";

console.log("Starting Electron . . . ");
import { BrowserWindow, app, ipcMain, nativeTheme } from "electron";
import { join } from "path";
import Dbmgmt from "./Dbmgmt";
import Ipchosts from "./Ipchost";
const dbFile: string = join(app.getPath("userData"), "/main.db");
const dbmgmt: Dbmgmt = new Dbmgmt(dbFile);
const ipchosts: Ipchosts = new Ipchosts(dbmgmt);

let splash: BrowserWindow;
let mainWindow: BrowserWindow;
let formsWindow: BrowserWindow;

const darkmode = (config.theme === "system") ? nativeTheme.shouldUseDarkColors : (config.theme === "dark");
nativeTheme.themeSource = darkmode?"dark":"light";
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
  await dbmgmt.start();
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
      darkTheme:darkmode,
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
        splash?.close();
      }, 2000);
    });
    splash.webContents.send("log", "Executing vue.js framework");
    if (config.isDevelopement) {
      await mainWindow.loadURL("http://localhost:8000");
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
      parent: mainWindow,
      webPreferences: {
        nodeIntegration: false,
        preload: join(__dirname, "./preload.js")
      },
      resizable: true,
      minimizable:false,
      darkTheme:darkmode,
      backgroundColor: darkmode ? "#000000" : "#ffffff"
    });
    formsWindow.setMenu(null);
    formsWindow.on("closed", function () {
      formsWindow = null;
    });
    if (config.isDevelopement) {
      await formsWindow.loadURL("http://localhost:8000/forms.html?form=" + type);
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
let isAppQuitting = false;
async function appQuit() {
  if (isAppQuitting) return;
  isAppQuitting = true;
  try{
  await dbmgmt.closeDB();
  }catch(e){
    console.log(e);
  }
  app.quit();
}
