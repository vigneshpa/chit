import { ipcMain, BrowserWindow } from "electron";
import * as dbmgmt from "./asyncDatabase";
import { join } from "path";
export async function initialise(): Promise<void> {

    ipcMain.on("create-user-account", async function (event, data: createUserFields) {
        let err: sqliteError;
        let response: { result: any; success?: boolean; };
        console.log("\nRecived Message From Renderer to create user\n", event, data);
        try {
            response = await dbmgmt.createUser(data.name, data.phone, data.address,);
        } catch (err1) {
            err = err1;
        }
        event.sender.send("create-user-account", err, response.result);
    });

    ipcMain.on("create-group", async function (event, data: createGroupFields) {
        let err: sqliteError;
        let response: { result: any; success?: boolean; };
        console.log("Recived message from Renderer to create group", event, data);
        try {
            response = await dbmgmt.createGroup(data.year, data.month, data.batch, data.members);
        } catch (err1) {
            err = err1;
        }
        event.sender.send("create-group", err, response.result);
    });
    ipcMain.on("ping", function (event, ...args) {
        console.log("Recived ping from renderer", args);
        console.log("Sending pong to the renderer");
        event.sender.send("pong", ...args);
    });
    ipcMain.on("get-users-data", async function (event) {
        console.log("Recived message from renderer to get users data");
        const result = await dbmgmt.listUsers();
        console.log("Sending users data to the renderer");
        event.sender.send("get-users-data", result);
    });

    ipcMain.on("open-forms", function (event) {
        let formsWindow = new BrowserWindow({
            height: 1080,
            width: 720,
            webPreferences: {
                nodeIntegration: true
            }
        });
        formsWindow.loadFile(join(__dirname, "./windows/forms/index.html"));
    });
    ipcMain.on("get-groups-data",async function (event) {
        console.log("Recived message from renderer to get groups data");
        const result = await dbmgmt.listGroups();
        console.log("Sending groups data to the renderer.");
        event.sender.send("get-groups-data", result);
    });
}