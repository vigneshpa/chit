console.log("Starting Electron . . . ");
import { BrowserWindow, app, ipcMain } from "electron";
import { join } from "path";

let splash: BrowserWindow;
let mainWindow: BrowserWindow;

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
  //splash.webContents.openDevTools();
});

ipcMain.on("splash-ready", async function (event) {
  console.log("Splash is ready");
  splash.webContents.send("log", "Connecting to the database");
  await (await import("./asyncDatabase")).start();
  splash.webContents.send("log", "Initialising Inter Process Communication(IPC)");
  const ipc = await import("./ipchost");
  ipc.setOnPingRecived(()=>{
    setTimeout(()=>splash.close(), 2000);
  });
  ipc.initialise();
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
    mainWindow.loadFile(join(__dirname, "./windows/index.html"));
    mainWindow.on("ready-to-show", function () {
      splash.webContents.send("log", "Loading vue.js framework");
      mainWindow.show();
    });
  } else {
    mainWindow.focus();
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    appQuit();
  }
});

async function appQuit() {
  await (await import("./asyncDatabase")).closeDB();
  app.quit();
}
