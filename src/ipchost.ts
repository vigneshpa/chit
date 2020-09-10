import { ipcMain, BrowserWindow } from "electron";
import * as dbmgmt from "./database";
import { join } from "path";
export async function initialise():Promise<any> {

    ipcMain.on("create-user-account", function (event, data: createUserFields) {
        console.log("\nRecived Message From Renderer to create user\n", event, data);
        dbmgmt.createUser(data.name, data.phone, data.address, function (err:Error, row:createUserFields) {
            event.sender.send("create-user-account", err, row);
        });
    });

    ipcMain.on("create-group", function (event, data: createGroupFields) {
        console.log("Recived message from Renderer to create group", event, data);
        dbmgmt.createGroup(data.year, data.month, data.batch, data.members, function(err:Error, row:createGroupFields){
            event.sender.send("create-group", err, row);
        });
    });
    ipcMain.on("ping", function(event, ...args){
        console.log("Recived ping from renderer", args);
        console.log("Sending pong to the renderer");
        event.sender.send("pong", ...args);
    });
    ipcMain.on("get-users-data", function(event){
        console.log("Recived message from renderer to get users data");
        dbmgmt.listUsers(function(err, rows){
            console.log("Sending users data to the renderer");
            event.sender.send("get-users-data", err, rows);
            if(err) throw err;
        })
    });

    ipcMain.on("open-forms", function(event){
        let formsWindow = new BrowserWindow({
            height:1080,
            width:720,
            webPreferences:{
                nodeIntegration:true
            }
        });
        formsWindow.loadFile(join(__dirname, "./windows/forms/index.html"));
    });
    ipcMain.on("get-groups-data", function(event){
        console.log("Recived message from renderer to get groups data");
        dbmgmt.listGroups(function(err, rows){
            console.log("Sending groups data to the renderer.");
            event.sender.send("get-groups-data", err, rows);
            if(err) throw err;
        });
    });
}