"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
class Ipchosts {
    constructor(dbmgmt) {
        this.dbmgmt = dbmgmt;
        this.events = {};
    }
    on(key, callback) {
        this.events[key] = callback;
    }
    async initialise() {
        electron_1.ipcMain.on("ping", event => {
            console.log("Recived ping from renderer");
            console.log("Sending pong to the renderer");
            event.sender.send("pong");
            this.events["pingRecived"]();
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
            this.events["openForm"](type, args);
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
            this.events.showMessageBox(options);
        });
        electron_1.ipcMain.on("show-dialog", async (event, type, options) => {
            let ret;
            switch (type) {
                case "open":
                    ret = await this.events.showOpenDialog(options);
                    break;
                case "messagebox":
                    ret = await this.events.showMessageBox(options);
                    break;
            }
            ;
            event.sender.send("show-dialog", ret);
        });
        electron_1.ipcMain.on("open-external", (event, url) => {
            this.events.openExternal(url);
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
                    newConfig.databaseFile.location = path_1.join(this.events.getPath("userData"), "./main.db");
                if (global.config.databaseFile.location !== newConfig.databaseFile.location) {
                    this.events.showMessageBox({
                        message: "Looks like you have changed the database file. The app must restart to use the new database. The app will restart in 10 seconds",
                        title: "Database file changed"
                    });
                    setTimeout(() => {
                        this.events.appQuit();
                    }, 10000);
                }
                global.config = newConfig;
                event.sender.send("update-config", true);
            });
        });
    }
}
exports.default = Ipchosts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXBjaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JcGNob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW1DO0FBQ25DLDJCQUErQjtBQUMvQiwrQkFBNEI7QUFHNUIsTUFBTSxRQUFRO0lBZVYsWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFOTSxFQUFFLENBQUMsR0FBVSxFQUFFLFFBQThCO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQ2hDLENBQUM7SUFLRCxLQUFLLENBQUMsVUFBVTtRQUNaLGtCQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQXNCLEVBQUUsRUFBRTtZQUM5RCxJQUFJLEdBQWdCLENBQUM7WUFDckIsSUFBSSxRQUE2QyxDQUFDO1lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0RBQWtELEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkYsSUFBSTtnQkFDQSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2hGO1lBQUMsT0FBTyxJQUFJLEVBQUU7Z0JBQ1gsR0FBRyxHQUFHLElBQUksQ0FBQzthQUNkO1lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUF1QixFQUFFLEVBQUU7WUFDaEUsSUFBSSxHQUFnQixDQUFDO1lBQ3JCLElBQUksUUFBNkMsQ0FBQztZQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BGLElBQUk7Z0JBQ0EsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzdGO1lBQUMsT0FBTyxJQUFJLEVBQUU7Z0JBQ1gsR0FBRyxHQUFHLElBQUksQ0FBQzthQUNkO1lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUMsS0FBSyxFQUFDLEVBQUU7WUFFdkMsTUFBTSxNQUFNLEdBQWUsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUVsRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBVyxFQUFFLEVBQUU7WUFDeEQsTUFBTSxNQUFNLEdBQXFCLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO1lBRWxFLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxFQUFDLEtBQUssRUFBQyxFQUFFO1lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0RBQWtELENBQUMsQ0FBQztZQUNoRSxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBRXBELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxFQUFFLElBQVksRUFBRSxJQUEwQixFQUFFLEVBQUU7WUFDekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFhLEVBQUUsRUFBRTtZQUN0RCxJQUFJLEdBQWdCLENBQUM7WUFDckIsSUFBSSxNQUFlLENBQUM7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUMzRCxJQUFJO2dCQUNBLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2hEO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsR0FBRyxHQUFHLENBQUMsQ0FBQzthQUNYO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFFdEUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQWEsRUFBRSxLQUFhLEVBQUUsSUFBWSxFQUFFLEVBQUU7WUFDbkYsSUFBSSxHQUFnQixDQUFDO1lBQ3JCLElBQUksTUFBZSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsS0FBSyxHQUFHLFlBQVksR0FBRyxLQUFLLENBQUMsQ0FBQztZQUM1RSxJQUFJO2dCQUNBLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDN0Q7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQ1g7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUUvRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBR0gsa0JBQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBMEIsRUFBRSxFQUFFO1lBRWpFLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBNkIsRUFBRSxPQUFnRCxFQUFFLEVBQUU7WUFDdkgsSUFBSSxHQUFvRCxDQUFDO1lBQ3pELFFBQVEsSUFBSSxFQUFFO2dCQUNWLEtBQUssTUFBTTtvQkFFUCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBb0IsT0FBTyxDQUFDLENBQUM7b0JBQ25FLE1BQU07Z0JBQ1YsS0FBSyxZQUFZO29CQUViLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFvQixPQUFPLENBQUMsQ0FBQztvQkFDbkUsTUFBTTthQUNiO1lBQUEsQ0FBQztZQUVGLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFXLEVBQUUsRUFBRTtZQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRTtZQUM3QixLQUFLLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBd0IsRUFBRSxFQUFFO1lBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUMvQyxjQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtnQkFDbkUsSUFBSSxHQUFHLEVBQUU7b0JBQ0wsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMxQyxNQUFNLEdBQUcsQ0FBQztpQkFDYjtnQkFBQSxDQUFDO2dCQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVE7b0JBQUUsU0FBUyxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsV0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUUzSCxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRTtvQkFDekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7d0JBQ3ZCLE9BQU8sRUFBRSxpSUFBaUk7d0JBQzFJLEtBQUssRUFBRSx1QkFBdUI7cUJBQ2pDLENBQUMsQ0FBQztvQkFDSCxVQUFVLENBQUMsR0FBRSxFQUFFO3dCQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQzFCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDYjtnQkFDRCxNQUFNLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztnQkFFMUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxRQUFRLENBQUMifQ==