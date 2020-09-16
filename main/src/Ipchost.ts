import { BrowserWindow, dialog, ipcMain, MessageBoxOptions, shell } from "electron";
import Dbmgmt from "./Dbmgmt";

class Ipchosts {
    private dbmgmt: Dbmgmt;
    private onOpenForm: (type: string) => void;
    constructor(dbmgmt: Dbmgmt) {
        this.dbmgmt = dbmgmt;
    }
    private onPingRecived: () => void = function () { }
    setOnPingRecived(onPingRecivedFn: () => void): void {
        this.onPingRecived = onPingRecivedFn;
    }
    setOnOpenForm(onOpenFormFn: (type: string) => void) {
        this.onOpenForm = onOpenFormFn;
    }
    async initialise(): Promise<void> {
        ipcMain.on("ping", event => {
            console.log("Recived ping from renderer");
            console.log("Sending pong to the renderer");
            event.sender.send("pong");
            this.onPingRecived();
        });

        ipcMain.on("create-user", async (event, data: createUserFields) => {
            let err: sqliteError;
            let response: { result: any; success?: boolean; };
            console.log("\nRecived Message From Renderer to create user\n", event, data);
            try {
                response = await this.dbmgmt.createUser(data.name, data.phone, data.address,);
            } catch (err1) {
                err = err1;
            }
            event.sender.send("create-user", err, response.result);
        });

        ipcMain.on("create-group", async (event, data: createGroupFields) => {
            let err: sqliteError;
            let response: { result: any; success?: boolean; };
            console.log("Recived message from Renderer to create group", event, data);
            try {
                response = await this.dbmgmt.createGroup(data.year, data.month, data.batch, data.members);
            } catch (err1) {
                err = err1;
            }
            event.sender.send("create-group", err, response.result);
        });

        ipcMain.on("get-users-data", async event => {
            console.log("Recived message from renderer to get users data");
            const result = await this.dbmgmt.listUsers();
            console.log("Sending users data to the renderer");
            event.sender.send("get-users-data", result);
        });

        ipcMain.on("get-groups-data", async event => {
            console.log("Recived message from renderer to get groups data");
            const result = await this.dbmgmt.listGroups();
            console.log("Sending groups data to the renderer.");
            event.sender.send("get-groups-data", result);
        });

        ipcMain.on("open-forms", (event, type: string) => {
            this.onOpenForm(type);
        });

        ipcMain.on("phone-exists", async (event, phone: string) => {
            let err: sqliteError;
            let result: boolean;
            console.log("Checking existance phone number " + phone);
            try {
                result = await this.dbmgmt.checkPhone(phone);
            } catch (e) {
                err = e;
            }
            console.log("Phone number " + (result ? "" : "does not ") + "exists");
            event.sender.send("phone-exists", err, result);
        });

        ipcMain.on("show-message-box", (event, options:MessageBoxOptions)=>{
            dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender), options);
        });

        ipcMain.on("open-external", (event, url:string)=>{
            shell.openExternal(url);
        });
    }
}

export default Ipchosts;