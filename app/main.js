"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Starting Electron . . . ");
const electron_1 = require("electron");
const path_1 = require("path");
let splash;
let mainWindow;
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
});
electron_1.ipcMain.on("splash-ready", async function (event) {
    console.log("Splash is ready");
    splash.webContents.send("log", "Connecting to the database");
    await (await Promise.resolve().then(() => require("./asyncDatabase"))).start();
    splash.webContents.send("log", "Initialising Inter Process Communication(IPC)");
    const ipc = await Promise.resolve().then(() => require("./ipchost"));
    ipc.setOnPingRecived(() => {
        setTimeout(() => splash.close(), 2000);
    });
    ipc.initialise();
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
        mainWindow.loadFile(path_1.join(__dirname, "./windows/index.html"));
        mainWindow.on("ready-to-show", function () {
            splash.webContents.send("log", "Loading vue.js framework");
            mainWindow.show();
        });
    }
    else {
        mainWindow.focus();
    }
}
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        appQuit();
    }
});
async function appQuit() {
    await (await Promise.resolve().then(() => require("./asyncDatabase"))).closeDB();
    electron_1.app.quit();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3hDLHVDQUF1RDtBQUN2RCwrQkFBNEI7QUFFNUIsSUFBSSxNQUFxQixDQUFDO0FBQzFCLElBQUksVUFBeUIsQ0FBQztBQUU5QixjQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLFVBQVU7SUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBQzNELE1BQU0sR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDekIsS0FBSyxFQUFFLEdBQUc7UUFDVixNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNkLGVBQWUsRUFBRSxJQUFJO1NBQ3RCO1FBQ0QsS0FBSyxFQUFFLEtBQUs7UUFDWixTQUFTLEVBQUUsS0FBSztRQUNoQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsS0FBSztLQUNuQixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQyxDQUFDO0FBRXhELENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLEtBQUssV0FBVyxLQUFLO0lBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMvQixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztJQUM3RCxNQUFNLENBQUMsMkNBQWEsaUJBQWlCLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2hELE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSwrQ0FBK0MsQ0FBQyxDQUFDO0lBQ2hGLE1BQU0sR0FBRyxHQUFHLDJDQUFhLFdBQVcsRUFBQyxDQUFDO0lBQ3RDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFFLEVBQUU7UUFDdkIsVUFBVSxDQUFDLEdBQUUsRUFBRSxDQUFBLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNILEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNqQixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUscUJBQXFCLENBQUMsQ0FBQztJQUN0RCxRQUFRLEVBQUUsQ0FBQztBQUNiLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxRQUFRO0lBQ2YsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLFVBQVUsR0FBRyxJQUFJLHdCQUFhLENBQUM7WUFDN0IsTUFBTSxFQUFFLEdBQUc7WUFDWCxLQUFLLEVBQUUsSUFBSTtZQUNYLGNBQWMsRUFBRTtnQkFDZCxlQUFlLEVBQUUsS0FBSztnQkFDdEIsT0FBTyxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDO2FBQ3pDO1lBQ0QsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUN0QixPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFJLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQztRQUM3RCxVQUFVLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRTtZQUM3QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztZQUMzRCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7S0FDSjtTQUFNO1FBQ0wsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3BCO0FBQ0gsQ0FBQztBQUVELGNBQUcsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQy9CLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDakMsT0FBTyxFQUFFLENBQUM7S0FDWDtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsS0FBSyxVQUFVLE9BQU87SUFDcEIsTUFBTSxDQUFDLDJDQUFhLGlCQUFpQixFQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsRCxjQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDYixDQUFDIn0=