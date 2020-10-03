"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Loading configurations and environment variables . . .");
const config_1 = require("./config");
console.log("Starting Electron . . . ");
const electron_1 = require("electron");
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
console.log("Darkmode:", darkmode);
electron_1.app.on("ready", async (launchInfo) => {
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
    splash.on("closed", () => {
        splash = null;
    });
    await splash.loadFile(__dirname + "/resources/splash.html");
});
electron_1.ipcMain.on("splash-ready", async (event) => {
    console.log("Splash is ready");
    splash.webContents.send("log", "Connecting to the database");
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
            await appQuit();
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
            appQuit();
        });
        mainWindow.on("ready-to-show", function () {
            splash.webContents.send("log", "UI is ready<br/>Waiting for idle signal");
            mainWindow.show();
            setTimeout(function () {
                splash === null || splash === void 0 ? void 0 : splash.close();
            }, 2000);
        });
        splash.webContents.send("log", "Executing vue.js framework");
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
ipchosts.setOnPingRecived(() => {
    if (splash)
        splash.webContents.send("log", "Loading UI ");
});
ipchosts.setOnOpenForm(async (type) => {
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
            await formsWindow.loadURL("http://localhost:8080/forms.html?form=" + type);
            formsWindow.webContents.openDevTools();
        }
        else {
            await formsWindow.loadFile(path_1.join(__dirname, "./windows/forms.html"), { query: { "form": type } });
        }
    }
    else {
        console.log("Recived message from renderer to open ", type, "But it already exists.Focusing that.");
        formsWindow.focus();
    }
});
let isAppQuitting = false;
async function appQuit() {
    if (isAppQuitting)
        return;
    isAppQuitting = true;
    try {
        await dbmgmt.closeDB();
        electron_1.app.quit();
    }
    catch (e) {
        electron_1.app.quit();
        console.log(e);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUMsQ0FBQztBQUN0RSxxQ0FBOEI7QUFFOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3hDLHVDQUE0RTtBQUM1RSwrQkFBNEI7QUFDNUIscUNBQThCO0FBQzlCLHVDQUFpQztBQUNqQyxNQUFNLE1BQU0sR0FBVyxPQUFBLGdCQUFNLENBQUMsWUFBWSwwQ0FBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLGdCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBSSxDQUFDLGNBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDaEksTUFBTSxNQUFNLEdBQVcsSUFBSSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLE1BQU0sUUFBUSxHQUFhLElBQUksaUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxJQUFHLENBQUMsZ0JBQU0sQ0FBQyxZQUFZO0lBQUMsZ0JBQU0sQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ2pELGdCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFFdEMsSUFBSSxNQUFxQixDQUFDO0FBQzFCLElBQUksVUFBeUIsQ0FBQztBQUM5QixJQUFJLFdBQTBCLENBQUM7QUFDL0IsSUFBSSxRQUFpQixDQUFDO0FBU3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRW5DLGNBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxVQUFVLEVBQUMsRUFBRTtJQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLHlCQUF5QixDQUFDLENBQUM7SUFDM0Qs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