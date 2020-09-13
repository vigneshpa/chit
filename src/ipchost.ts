import { ipcMain } from "electron";
import Dbmgmt from "./Dbmgmt";

class Ipchosts {
    private dbmgmt: Dbmgmt;
    private onOpenForm:(type:string)=>void;
    constructor(dbmgmt: Dbmgmt) {
        this.dbmgmt = dbmgmt;
    }
    private onPingRecived: () => void = function () { }
    setOnPingRecived(onPingRecivedFn: () => void): void {
        this.onPingRecived = onPingRecivedFn;
    }
    setOnOpenForm(onOpenFormFn:(type:string)=>void){
        this.onOpenForm = onOpenFormFn;
    }
    async initialise(): Promise<void> {
        ipcMain.on("ping", function (event, ...args) {
            console.log("Recived ping from renderer", args);
            console.log("Sending pong to the renderer");
            event.sender.send("pong", ...args);
            this.onPingRecived();
        }.bind(this));

        ipcMain.on("create-user-account", async function (event, data: createUserFields) {
            let err: sqliteError;
            let response: { result: any; success?: boolean; };
            console.log("\nRecived Message From Renderer to create user\n", event, data);
            try {
                response = await this.dbmgmt.createUser(data.name, data.phone, data.address,);
            } catch (err1) {
                err = err1;
            }
            event.sender.send("create-user-account", err, response.result);
        }.bind(this));

        ipcMain.on("create-group", async function (event, data: createGroupFields) {
            let err: sqliteError;
            let response: { result: any; success?: boolean; };
            console.log("Recived message from Renderer to create group", event, data);
            try {
                response = await this.dbmgmt.createGroup(data.year, data.month, data.batch, data.members);
            } catch (err1) {
                err = err1;
            }
            event.sender.send("create-group", err, response.result);
        }.bind(this));

        ipcMain.on("get-users-data", async function (event) {
            console.log("Recived message from renderer to get users data");
            const result = await this.dbmgmt.listUsers();
            console.log("Sending users data to the renderer");
            event.sender.send("get-users-data", result);
        }.bind(this));

        ipcMain.on("get-groups-data", async function (event) {
            console.log("Recived message from renderer to get groups data");
            const result = await this.dbmgmt.listGroups();
            console.log("Sending groups data to the renderer.");
            event.sender.send("get-groups-data", result);
        }.bind(this));

        ipcMain.on("open-forms", function (event, type: string) {
            this.onOpenForm(type);
        }.bind(this));
    }
}

export default Ipchosts;