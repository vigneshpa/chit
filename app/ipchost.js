"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialise = exports.setOnPingRecived = void 0;
const electron_1 = require("electron");
const dbmgmt = require("./asyncDatabase");
const path_1 = require("path");
let onPingRecived;
function setOnPingRecived(onPingRecivedFn) {
    onPingRecived = onPingRecivedFn;
}
exports.setOnPingRecived = setOnPingRecived;
async function initialise() {
    electron_1.ipcMain.on("create-user-account", async function (event, data) {
        let err;
        let response;
        console.log("\nRecived Message From Renderer to create user\n", event, data);
        try {
            response = await dbmgmt.createUser(data.name, data.phone, data.address);
        }
        catch (err1) {
            err = err1;
        }
        event.sender.send("create-user-account", err, response.result);
    });
    electron_1.ipcMain.on("create-group", async function (event, data) {
        let err;
        let response;
        console.log("Recived message from Renderer to create group", event, data);
        try {
            response = await dbmgmt.createGroup(data.year, data.month, data.batch, data.members);
        }
        catch (err1) {
            err = err1;
        }
        event.sender.send("create-group", err, response.result);
    });
    electron_1.ipcMain.on("ping", function (event, ...args) {
        console.log("Recived ping from renderer", args);
        console.log("Sending pong to the renderer");
        event.sender.send("pong", ...args);
        onPingRecived();
    });
    electron_1.ipcMain.on("get-users-data", async function (event) {
        console.log("Recived message from renderer to get users data");
        const result = await dbmgmt.listUsers();
        console.log("Sending users data to the renderer");
        event.sender.send("get-users-data", result);
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
    electron_1.ipcMain.on("get-groups-data", async function (event) {
        console.log("Recived message from renderer to get groups data");
        const result = await dbmgmt.listGroups();
        console.log("Sending groups data to the renderer.");
        event.sender.send("get-groups-data", result);
    });
}
exports.initialise = initialise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXBjaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pcGNob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrRDtBQUNsRCwwQ0FBMEM7QUFDMUMsK0JBQTRCO0FBRTVCLElBQUksYUFBc0IsQ0FBQztBQUMzQixTQUFTLGdCQUFnQixDQUFDLGVBQXdCO0lBQzlDLGFBQWEsR0FBRyxlQUFlLENBQUM7QUFDcEMsQ0FBQztBQUNPLDRDQUFnQjtBQUVqQixLQUFLLFVBQVUsVUFBVTtJQUU1QixrQkFBTyxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLFdBQVcsS0FBSyxFQUFFLElBQXNCO1FBQzNFLElBQUksR0FBZ0IsQ0FBQztRQUNyQixJQUFJLFFBQTZDLENBQUM7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrREFBa0QsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0UsSUFBSTtZQUNBLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUUsQ0FBQztTQUM1RTtRQUFDLE9BQU8sSUFBSSxFQUFFO1lBQ1gsR0FBRyxHQUFHLElBQUksQ0FBQztTQUNkO1FBQ0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUMsQ0FBQztJQUVILGtCQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxLQUFLLFdBQVcsS0FBSyxFQUFFLElBQXVCO1FBQ3JFLElBQUksR0FBZ0IsQ0FBQztRQUNyQixJQUFJLFFBQTZDLENBQUM7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUUsSUFBSTtZQUNBLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3hGO1FBQUMsT0FBTyxJQUFJLEVBQUU7WUFDWCxHQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ2Q7UUFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUNILGtCQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLEtBQUssRUFBRSxHQUFHLElBQUk7UUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDNUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDbkMsYUFBYSxFQUFFLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLFdBQVcsS0FBSztRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7UUFDL0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ2xELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDO0lBRUgsa0JBQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQVUsS0FBSztRQUNwQyxJQUFJLFdBQVcsR0FBRyxJQUFJLHdCQUFhLENBQUM7WUFDaEMsTUFBTSxFQUFFLElBQUk7WUFDWixLQUFLLEVBQUUsR0FBRztZQUNWLGNBQWMsRUFBRTtnQkFDWixlQUFlLEVBQUUsSUFBSTthQUN4QjtTQUNKLENBQUMsQ0FBQztRQUNILFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBSSxDQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQyxDQUFDLENBQUM7SUFDSCxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBQyxLQUFLLFdBQVcsS0FBSztRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFDaEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQ3BELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQXRERCxnQ0FzREMifQ==