"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let isDevelopement = true;
console.log("Starting Electron . . . ");
const electron_1 = require("electron");
const path_1 = require("path");
const Dbmgmt_1 = require("./Dbmgmt");
const Ipchost_1 = require("./Ipchost");
const dbFile = path_1.join(electron_1.app.getPath("userData"), "/main.db");
const dbmgmt = new Dbmgmt_1.default(dbFile);
const ipchosts = new Ipchost_1.default(dbmgmt);
let splash;
let mainWindow;
let formsWindow;
electron_1.app.on("ready", function (launchInfo) {
    console.log("Got ready signal", "Displaying splash . . .");
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
    splash.loadFile(__dirname + "/resources/splash.html");
    splash.on("closed", function () {
        splash = null;
    });
});
electron_1.ipcMain.on("splash-ready", async function (event) {
    console.log("Splash is ready");
    splash.webContents.send("log", "Connecting to the database");
    dbmgmt.start();
    splash.webContents.send("log", "Initialising Inter Process Communication(IPC)");
    const ipc = await Promise.resolve().then(() => require("./Ipchost"));
    ipchosts.setOnPingRecived(() => {
        if (splash)
            splash.webContents.send("log", "Loading UI ");
    });
    ipchosts.initialise();
    splash.webContents.send("log", "Loading main window");
    loadMain();
});
function loadMain() {
    if (!mainWindow) {
        mainWindow = new electron_1.BrowserWindow({
            height: 720,
            width: 1080,
            webPreferences: {
                nodeIntegration: false,
                preload: path_1.join(__dirname, "./preload.js"),
            },
            show: false,
            darkTheme: false,
        });
        mainWindow.on("closed", function () {
            appQuit();
        });
        splash.webContents.send("log", "Executing vue.js framework");
        if (isDevelopement) {
            mainWindow.loadURL("http://localhost:8000");
        }
        else {
            mainWindow.loadFile(path_1.join(__dirname, "./windows/index.html"));
        }
        mainWindow.setMenu(null);
        mainWindow.on("ready-to-show", function () {
            splash.webContents.send("log", "UI is ready<br/>Waiting for idle signal");
            mainWindow.show();
            setTimeout(function () {
                splash === null || splash === void 0 ? void 0 : splash.close();
            }, 2000);
        });
    }
    else {
        mainWindow.focus();
    }
}
ipchosts.setOnOpenForm(function (type) {
    if (!formsWindow) {
        formsWindow = new electron_1.BrowserWindow({
            height: 400,
            width: 550,
            webPreferences: {
                nodeIntegration: false,
                preload: path_1.join(__dirname, "./preload.js")
            },
            resizable: false
        });
        formsWindow.setMenu(null);
        console.log("Recived message from renderer to open ", type);
        if (isDevelopement) {
            formsWindow.loadURL("http://localhost:8000/forms.html?form=" + type);
            formsWindow.webContents.openDevTools();
        }
        else {
            formsWindow.loadFile(path_1.join(__dirname, "./windows/forms.html?form=" + type));
        }
        formsWindow.on("closed", function () {
            formsWindow = null;
        });
    }
    else {
        console.log("Recived message from renderer to open ", type, "But it already exists.Focusing that.");
        formsWindow.focus();
    }
});
async function appQuit() {
    electron_1.app.quit();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBRTFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN4Qyx1Q0FBdUQ7QUFDdkQsK0JBQTRCO0FBQzVCLHFDQUE4QjtBQUM5Qix1Q0FBaUM7QUFDakMsTUFBTSxNQUFNLEdBQVcsV0FBSSxDQUFDLGNBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDakUsTUFBTSxNQUFNLEdBQVcsSUFBSSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLE1BQU0sUUFBUSxHQUFhLElBQUksaUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVoRCxJQUFJLE1BQXFCLENBQUM7QUFDMUIsSUFBSSxVQUF5QixDQUFDO0FBQzlCLElBQUksV0FBMEIsQ0FBQztBQUUvQixjQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLFVBQVU7SUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBQzNELE1BQU0sR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDekIsS0FBSyxFQUFFLEdBQUc7UUFDVixNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNkLGVBQWUsRUFBRSxJQUFJO1NBQ3RCO1FBQ0QsS0FBSyxFQUFFLEtBQUs7UUFDWixTQUFTLEVBQUUsS0FBSztRQUNoQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsS0FBSztLQUNuQixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3RELE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FB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