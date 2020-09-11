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
        splash.webContents.send("log", "Loading UI ...");
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
        splash.webContents.send("log", "Executing vue.js framework");
        if (isDeveopement) {
            mainWindow.loadURL("http://localhost:8000");
        }
        else {
            mainWindow.loadFile(path_1.join(__dirname, "./windows/index.html"));
        }
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
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        appQuit();
    }
});
async function appQuit() {
    await (await Promise.resolve().then(() => require("./asyncDatabase"))).closeDB();
    electron_1.app.quit();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBRXpCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN4Qyx1Q0FBdUQ7QUFDdkQsK0JBQTRCO0FBRTVCLElBQUksTUFBcUIsQ0FBQztBQUMxQixJQUFJLFVBQXlCLENBQUM7QUFFOUIsY0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxVQUFVO0lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUseUJBQXlCLENBQUMsQ0FBQztJQUMzRCxNQUFNLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQ3pCLEtBQUssRUFBRSxHQUFHO1FBQ1YsTUFBTSxFQUFFLEdBQUc7UUFDWCxjQUFjLEVBQUU7WUFDZCxlQUFlLEVBQUUsSUFBSTtTQUN0QjtRQUNELEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxFQUFFLEtBQUs7UUFDaEIsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLEtBQUs7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsd0JBQXdCLENBQUMsQ0FBQztBQUV4RCxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxLQUFLLFdBQVcsS0FBSztJQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDL0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLDRCQUE0QixDQUFDLENBQUM7SUFDN0QsTUFBTSxDQUFDLDJDQUFhLGlCQUFpQixFQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNoRCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsK0NBQStDLENBQUMsQ0FBQztJQUNoRixNQUFNLEdBQUcsR0FBRywyQ0FBYSxXQUFXLEVBQUMsQ0FBQztJQUN0QyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsR0FBRSxFQUFFO1FBQ3ZCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0gsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2pCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3RELFFBQVEsRUFBRSxDQUFDO0FBQ2IsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLFFBQVE7SUFDZixJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2YsVUFBVSxHQUFHLElBQUksd0JBQWEsQ0FBQztZQUM3QixNQUFNLEVBQUUsR0FBRztZQUNYLEtBQUssRUFBRSxJQUFJO1lBQ1gsY0FBYyxFQUFFO2dCQUNkLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixPQUFPLEVBQUUsV0FBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUM7YUFDekM7WUFDRCxJQUFJLEVBQUUsS0FBSztZQUNYLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztRQUM3RCxJQUFHLGFBQWEsRUFBQztZQUNmLFVBQVUsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUM3QzthQUFLO1lBQ0osVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFJLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQztTQUM5RDtRQUNELFVBQVUsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO1lBQzFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQixVQUFVLENBQUM7Z0JBQ1QsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLEtBQUssR0FBRztZQUNsQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztLQUNKO1NBQU07UUFDTCxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDcEI7QUFDSCxDQUFDO0FBRUQsY0FBRyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtRQUNqQyxPQUFPLEVBQUUsQ0FBQztLQUNYO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxLQUFLLFVBQVUsT0FBTztJQUNwQixNQUFNLENBQUMsMkNBQWEsaUJBQWlCLEVBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xELGNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNiLENBQUMifQ==