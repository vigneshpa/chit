"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialise = void 0;
const electron_1 = require("electron");
const dbmgmt = require("./database");
const path_1 = require("path");
function initialise() {
    electron_1.ipcMain.on("create-user-account", function (event, data) {
        console.log("\nRecived Message From Renderer to create user\n", event, data);
        dbmgmt.createUser(data.name, data.phone, data.address, function (err, row) {
            event.sender.send("create-user-account", err, row);
        });
    });
    electron_1.ipcMain.on("create-group", function (event, data) {
        console.log("Recived message from Renderer to create group", event, data);
        dbmgmt.createGroup(data.year, data.month, data.batch, data.members, function (err, row) {
            event.sender.send("create-group", err, row);
        });
    });
    electron_1.ipcMain.on("ping", function (event, ...args) {
        console.log("Recived ping from renderer", args);
        console.log("Sending pong to the renderer");
        event.sender.send("pong", ...args);
    });
    electron_1.ipcMain.on("get-users-data", function (event) {
        console.log("Recived message from renderer to get users data");
        dbmgmt.listUsers(function (err, rows) {
            console.log("Sending users data to the renderer");
            event.sender.send("get-users-data", err, rows);
            if (err)
                throw err;
        });
    });
    electron_1.ipcMain.on("open-forms", function (event) {
        let formsWindow = new electron_1.BrowserWindow({
            height: 1080,
            width: 720,
            webPreferences: {
                nodeIntegration: true
            }
        });
        formsWindow.loadFile(path_1.join(__dirname, "./windows/forms/index.html"));
    });
    electron_1.ipcMain.on("get-groups-data", function (event) {
        console.log("Recived message from renderer to get groups data");
        dbmgmt.listGroups(function (err, rows) {
            console.log("Sending groups data to the renderer.");
            event.sender.send("get-groups-data", err, rows);
            if (err)
                throw err;
        });
    });
}
exports.initialise = initialise;
