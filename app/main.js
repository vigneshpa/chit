"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let isDeveopement = true;
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
        if (isDeveopement) {
            mainWindow.loadURL("http://localhost:8000");
        }
        else {
            mainWindow.loadFile(path_1.join(__dirname, "./windows/index.html"));
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBRXpCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN4Qyx1Q0FBdUQ7QUFDdkQsK0JBQTRCO0FBRTVCLElBQUksTUFBcUIsQ0FBQztBQUMxQixJQUFJLFVBQXlCLENBQUM7QUFFOUIsY0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxVQUFVO0lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUseUJBQXlCLENBQUMsQ0FBQztJQUMzRCxNQUFNLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxHQUFHO1FBQ1YsTUFBTSxFQUFFLEdBQUc7UUFDWCxjQUFjLEVBQUU7WUFDZCxlQUFlLEVBQUUsSUFBSTtTQUN0QjtRQUNELEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxFQUFFLEtBQUs7UUFDaEIsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLEtBQUs7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsd0JBQXdCLENBQUMsQ0FBQztBQUV4RCxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxLQUFLLFdBQVcsS0FBSztJQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDL0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLDRCQUE0QixDQUFDLENBQUM7SUFDN0QsTUFBTSxDQUFDLDJDQUFhLGlCQUFpQixFQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNoRCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsK0NBQStDLENBQUMsQ0FBQztJQUNoRixNQUFNLEdBQUcsR0FBRywyQ0FBYSxXQUFXLEVBQUMsQ0FBQztJQUN0QyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsR0FBRSxFQUFFO1FBQ3ZCLFVBQVUsQ0FBQyxHQUFFLEVBQUUsQ0FBQSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDSCxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDakIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDdEQsUUFBUSxFQUFFLENBQUM7QUFDYixDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsUUFBUTtJQUNmLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZixVQUFVLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1lBQzdCLE1BQU0sRUFBRSxHQUFHO1lBQ1gsS0FBSyxFQUFFLElBQUk7WUFDWCxjQUFjLEVBQUU7Z0JBQ2QsZUFBZSxFQUFFLEtBQUs7Z0JBQ3RCLE9BQU8sRUFBRSxXQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQzthQUN6QztZQUNELElBQUksRUFBRSxLQUFLO1lBQ1gsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsVUFBVSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDdEIsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztRQUVILElBQUcsYUFBYSxFQUFDO1lBQ2YsVUFBVSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQzdDO2FBQUs7WUFDSixVQUFVLENBQUMsUUFBUSxDQUFDLFdBQUksQ0FBQyxTQUFTLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1NBQzlEO1FBQ0QsVUFBVSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUU7WUFDN0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLDBCQUEwQixDQUFDLENBQUM7WUFDM0QsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0tBQ0o7U0FBTTtRQUNMLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNwQjtBQUNILENBQUM7QUFFRCxjQUFHLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQ2pDLE9BQU8sRUFBRSxDQUFDO0tBQ1g7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILEtBQUssVUFBVSxPQUFPO0lBQ3BCLE1BQU0sQ0FBQywyQ0FBYSxpQkFBaUIsRUFBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEQsY0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2IsQ0FBQyJ9