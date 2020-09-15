let isDevelopement = true;

console.log("Starting Electron . . . ");
import { BrowserWindow, app, ipcMain } from "electron";
import { join } from "path";
import Dbmgmt from "./Dbmgmt";
import Ipchosts from "./Ipchost";
const dbFile: string = join(app.getPath("userData"), "/main.db");
const dbmgmt: Dbmgmt = new Dbmgmt(dbFile);
const ipchosts: Ipchosts = new Ipchosts(dbmgmt);

let splash: BrowserWindow;
let mainWindow: BrowserWindow;
let formsWindow: BrowserWindow;

app.on("ready", function (launchInfo) {
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
  splash.loadFile(__dirname + "/resources/splash.html");
  splash.on("closed", function () {
    splash = null;
  });
  //splash.webContents.openDevTools();
});

ipcMain.on("splash-ready", async function (event) {
  console.log("Splash is ready");
  splash.webContents.send("log", "Connecting to the database");
  dbmgmt.start();
  splash.webContents.send("log", "Initialising Inter Process Communication(IPC)");
  const ipc = await import("./Ipchost");
  ipchosts.setOnPingRecived(() => {
    if (splash) splash.webContents.send("log", "Loading UI ");
  });
  ipchosts.initialise();
  splash.webContents.send("log", "Loading main window");
  loadMain();
});

function loadMain() {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      height: 720,
      width: 1080,
      webPreferences: {
        nodeIntegration: false,
        preload: join(__dirname, "./preload.js"),
      },
      show: false,
      darkTheme: false,
    });
    mainWindow.on("closed", function () {
      appQuit();
    });
    //mainWindow.loadFile(join(__dirname, "/windows/main/index.html"));
    splash.webContents.send("log", "Executing vue.js framework");
    if (isDevelopement) {
      mainWindow.loadURL("http://localhost:8000");
    } else {
      mainWindow.loadFile(join(__dirname, "./windows/index.html"));
    }
    mainWindow.setMenu(null);
    mainWindow.on("ready-to-show", function () {
      splash.webContents.send("log", "UI is ready<br/>Waiting for idle signal");
      mainWindow.show();
      setTimeout(function () {
        splash?.close();
      }, 2000);
    });
  } else {
    mainWindow.focus();
  }
}

ipchosts.setOnOpenForm(function (type) {
  if (!formsWindow) {
    formsWindow = new BrowserWindow({
      height: 400,
      width: 550,
      webPreferences: {
        nodeIntegration: false,
        preload: join(__dirname, "./preload.js")
      },
      resizable: false
    });
    formsWindow.setMenu(null);
    console.log("Recived message from renderer to open ", type);
    if (isDevelopement) {
      formsWindow.loadURL("http://localhost:8000/forms.html?form=" + type);
      formsWindow.webContents.openDevTools();
    } else {
      formsWindow.loadURL("file:///"+join(__dirname, "./windows/forms.html")+"?form=" + type);
    }
    formsWindow.on("closed", function () {
      formsWindow = null;
    });
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

async function appQuit() {
  app.quit();
}
