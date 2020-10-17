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
            event.sender.send("create-user", err, response.result);
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
            event.sender.send("create-group", err, response.result);
        });
        electron_1.ipcMain.on("get-users-data", async (event) => {
            console.log("Recived message from renderer to get users data");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXBjaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JcGNob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQTBKO0FBQzFKLDJCQUErQjtBQUMvQiwrQkFBNEI7QUFHNUIsTUFBTSxRQUFRO0lBR1YsWUFBWSxNQUFjO1FBR2xCLGtCQUFhLEdBQWUsY0FBYyxDQUFDLENBQUE7UUFGL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELGdCQUFnQixDQUFDLGVBQTJCO1FBQ3hDLElBQUksQ0FBQyxhQUFhLEdBQUcsZUFBZSxDQUFDO0lBQ3pDLENBQUM7SUFDRCxhQUFhLENBQUMsWUFBb0M7UUFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUM7SUFDbkMsQ0FBQztJQUNELEtBQUssQ0FBQyxVQUFVO1FBQ1osa0JBQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBc0IsRUFBRSxFQUFFO1lBQzlELElBQUksR0FBZ0IsQ0FBQztZQUNyQixJQUFJLFFBQTZDLENBQUM7WUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrREFBa0QsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RixJQUFJO2dCQUNBLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDaEY7WUFBQyxPQUFPLElBQUksRUFBRTtnQkFDWCxHQUFHLEdBQUcsSUFBSSxDQUFDO2FBQ2Q7WUFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQXVCLEVBQUUsRUFBRTtZQUNoRSxJQUFJLEdBQWdCLENBQUM7WUFDckIsSUFBSSxRQUE2QyxDQUFDO1lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEYsSUFBSTtnQkFDQSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDN0Y7WUFBQyxPQUFPLElBQUksRUFBRTtnQkFDWCxHQUFHLEdBQUcsSUFBSSxDQUFDO2FBQ2Q7WUFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBRTtZQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7WUFDL0QsTUFBTSxNQUFNLEdBQWUsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUNsRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBRTtZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7WUFDaEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQztZQUNwRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFZLEVBQUUsRUFBRTtZQUM3QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBYSxFQUFFLEVBQUU7WUFDdEQsSUFBSSxHQUFnQixDQUFDO1lBQ3JCLElBQUksTUFBZSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDM0QsSUFBSTtnQkFDQSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNoRDtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLEdBQUcsR0FBRyxDQUFDLENBQUM7YUFDWDtZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQ3RFLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFhLEVBQUUsS0FBYSxFQUFFLElBQVksRUFBRSxFQUFFO1lBQ25GLElBQUksR0FBZ0IsQ0FBQztZQUNyQixJQUFJLE1BQWUsQ0FBQztZQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLEtBQUssR0FBRyxZQUFZLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDNUUsSUFBSTtnQkFDQSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzdEO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsR0FBRyxHQUFHLENBQUMsQ0FBQzthQUNYO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDL0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztRQUdILGtCQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUMsS0FBSyxFQUFFLE9BQTBCLEVBQUUsRUFBRTtZQUNqRSxpQkFBTSxDQUFDLGNBQWMsQ0FBQyx3QkFBYSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUE2QixFQUFFLE9BQWdELEVBQUUsRUFBRTtZQUN2SCxJQUFJLEdBQWlELENBQUM7WUFDdEQsUUFBUSxJQUFJLEVBQUU7Z0JBQ1YsS0FBSyxNQUFNO29CQUNQLEdBQUcsR0FBRyxNQUFNLGlCQUFNLENBQUMsY0FBYyxDQUFDLHdCQUFhLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBcUIsT0FBTyxDQUFDLENBQUM7b0JBQzNHLE1BQU07Z0JBQ1YsS0FBSyxZQUFZO29CQUNiLEdBQUcsR0FBRyxNQUFNLGlCQUFNLENBQUMsY0FBYyxDQUFDLHdCQUFhLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBcUIsT0FBTyxDQUFDLENBQUM7b0JBQzNHLE1BQU07YUFDYjtZQUFBLENBQUM7WUFDRixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBVyxFQUFFLEVBQUU7WUFDL0MsZ0JBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDN0IsS0FBSyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQXdCLEVBQUUsRUFBRTtZQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFDL0MsY0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUMvRCxJQUFJLEdBQUcsRUFBRTtvQkFDTCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzFDLE1BQU0sR0FBRyxDQUFDO2lCQUNiO2dCQUFBLENBQUM7Z0JBQ0YsSUFBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUTtvQkFBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxXQUFJLENBQUMsY0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFFakgsSUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUU7b0JBQ3hFLGlCQUFNLENBQUMsY0FBYyxDQUFDO3dCQUNsQixPQUFPLEVBQUMsaUlBQWlJO3dCQUN6SSxLQUFLLEVBQUMsdUJBQXVCO3FCQUNoQyxDQUFDLENBQUM7b0JBQ0gsVUFBVSxDQUFDO3dCQUNQLGNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDZixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ2I7Z0JBQ0QsTUFBTSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQzFCLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBRUQsa0JBQWUsUUFBUSxDQUFDIn0=