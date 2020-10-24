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
        electron_1.ipcMain.on("get-groups-data", async (event) => {
            console.log("Recived message from renderer to get groups data");
            const result = await this.dbmgmt.listGroups();
            console.log("Sending groups data to the renderer.");
            event.sender.send("get-groups-data", result);
        });
        electron_1.ipcMain.on("open-forms", (event, type) => {
            this.onOpenForm(type);
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
            fs_1.writeFile(newConfig.configPath, JSON.stringify(newConfig), (err) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXBjaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JcGNob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQTBKO0FBQzFKLDJCQUErQjtBQUMvQiwrQkFBNEI7QUFHNUIsTUFBTSxRQUFRO0lBR1YsWUFBWSxNQUFjO1FBR2xCLGtCQUFhLEdBQWUsY0FBYyxDQUFDLENBQUE7UUFGL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELGdCQUFnQixDQUFDLGVBQTJCO1FBQ3hDLElBQUksQ0FBQyxhQUFhLEdBQUcsZUFBZSxDQUFDO0lBQ3pDLENBQUM7SUFDRCxhQUFhLENBQUMsWUFBb0M7UUFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUM7SUFDbkMsQ0FBQztJQUNELEtBQUssQ0FBQyxVQUFVO1FBQ1osa0JBQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBc0IsRUFBRSxFQUFFO1lBQzlELElBQUksR0FBZ0IsQ0FBQztZQUNyQixJQUFJLFFBQTZDLENBQUM7WUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrREFBa0QsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RixJQUFJO2dCQUNBLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENB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