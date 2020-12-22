"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
class Ipchosts {
    constructor(dbmgmt) {
        this.onPingRecived = function () { };
        this.dbmgmt = dbmgmt;
    }
    setOnPingRecived(onPingRecivedFn) {
        this.onPingRecived = onPingRecivedFn;
    }
    setOnOpenForm(onOpenFormFn) {
        this.onOpenForm = onOpenFormFn;
    }
    async initialise() {
        electron_1.ipcMain.on("ping", event => {
            console.log("Recived ping from renderer");
            console.log("Sending pong to the renderer");
            event.sender.send("pong");
            this.onPingRecived();
        });
        electron_1.ipcMain.on("create-user", async (event, data) => {
            let err;
            let response;
            console.log("\nRecived Message From Renderer to create user\n", event.sender.id, data);
            try {
                response = await this.dbmgmt.createUser(data.name, data.phone, data.address);
            }
            catch (err1) {
                err = err1;
            }
            event.sender.send("create-user", err, response === null || response === void 0 ? void 0 : response.result);
        });
        electron_1.ipcMain.on("create-group", async (event, data) => {
            let err;
            let response;
            console.log("Recived message from Renderer to create group", event.sender.id, data);
            try {
                response = await this.dbmgmt.createGroup(data.year, data.month, data.batch, data.members);
            }
            catch (err1) {
                err = err1;
            }
            event.sender.send("create-group", err, response === null || response === void 0 ? void 0 : response.result);
        });
        electron_1.ipcMain.on("get-users-data", async (event) => {
            const result = await this.dbmgmt.listUsers();
            console.log("Sending users data to the renderer");
            event.sender.send("get-users-data", result);
        });
        electron_1.ipcMain.on("get-user-details", async (event, UID) => {
            const result = await this.dbmgmt.userDetails(UID);
            console.log("Sending " + result.name + "'s data to the renderer");
            event.sender.send("get-user-details", result);
        });
        electron_1.ipcMain.on("get-groups-data", async (event) => {
            console.log("Recived message from renderer to get groups data");
            const result = await this.dbmgmt.listGroups();
            console.log("Sending groups data to the renderer.");
            event.sender.send("get-groups-data", result);
        });
        electron_1.ipcMain.on("open-forms", (event, type, args) => {
            this.onOpenForm(type, args);
        });
        electron_1.ipcMain.on("phone-exists", async (event, phone) => {
            let err;
            let result;
            console.log("Checking existance of phone number " + phone);
            try {
                result = await this.dbmgmt.checkPhone(phone);
            }
            catch (e) {
                err = e;
            }
            console.log("Phone number " + (result ? "" : "does not ") + "exists");
            event.sender.send("phone-exists", err, result);
        });
        electron_1.ipcMain.on("batch-exists", async (event, batch, month, year) => {
            let err;
            let result;
            console.log("Checking existance of Batch  " + batch + " in month " + month);
            try {
                result = await this.dbmgmt.checkBatch(batch, month, year);
            }
            catch (e) {
                err = e;
            }
            console.log("Batch " + (result ? "" : "does not ") + "exists");
            event.sender.send("batch-exists", err, result);
        });
        electron_1.ipcMain.on("show-message-box", (event, options) => {
            electron_1.dialog.showMessageBox(electron_1.BrowserWindow.fromWebContents(event.sender), options);
        });
        electron_1.ipcMain.on("show-dialog", async (event, type, options) => {
            let ret;
            switch (type) {
                case "open":
                    ret = await electron_1.dialog.showOpenDialog(electron_1.BrowserWindow.fromWebContents(event.sender), options);
                    break;
                case "messagebox":
                    ret = await electron_1.dialog.showMessageBox(electron_1.BrowserWindow.fromWebContents(event.sender), options);
                    break;
            }
            ;
            event.sender.send("show-dialog", ret);
        });
        electron_1.ipcMain.on("open-external", (event, url) => {
            electron_1.shell.openExternal(url);
        });
        electron_1.ipcMain.on("get-config", event => {
            event.returnValue = global.config;
        });
        electron_1.ipcMain.on("update-config", (event, newConfig) => {
            console.log("Updating Configuration file ...");
            fs_1.writeFile(newConfig.configPath, JSON.stringify(newConfig), async (err) => {
                if (err) {
                    event.sender.send("update-config", false);
                    throw err;
                }
                ;
                if (!newConfig.databaseFile.isCustom)
                    newConfig.databaseFile.location = path_1.join(electron_1.app.getPath("userData"), "./main.db");
                if (global.config.databaseFile.location !== newConfig.databaseFile.location) {
                    electron_1.dialog.showMessageBox({
                        message: "Looks like you have changed the database file. The app must restart to use the new database. The app will restart in 10 seconds",
                        title: "Database file changed"
                    });
                    setTimeout(function () {
                        electron_1.app.quit();
                    }, 10000);
                }
                global.config = newConfig;
                event.sender.send("update-config", true);
            });
        });
    }
}
exports.default = Ipchosts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXBjaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JcGNob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQTBKO0FBQzFKLDJCQUErQjtBQUMvQiwrQkFBNEI7QUFHNUIsTUFBTSxRQUFRO0lBR1YsWUFBWSxNQUFjO1FBR2xCLGtCQUFhLEdBQWUsY0FBYyxDQUFDLENBQUE7UUFGL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELGdCQUFnQixDQUFDLGVBQTJCO1FBQ3hDLElBQUksQ0FBQyxhQUFhLEdBQUcsZUFBZSxDQUFDO0lBQ3pDLENBQUM7SUFDRCxhQUFhLENBQUMsWUFBZ0U7UUFDMUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUM7SUFDbkMsQ0FBQztJQUNELEtBQUssQ0FBQyxVQUFVO1FBQ1osa0JBQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBc0IsRUFBRSxFQUFFO1lBQzlELElBQUksR0FBZ0IsQ0FBQztZQUNyQixJQUFJLFFBQTZDLENBQUM7WUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrREFBa0QsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RixJQUFJO2dCQUNBLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENB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