import { app, BrowserWindow, dialog, ipcMain, MessageBoxOptions, MessageBoxReturnValue, OpenDialogOptions, OpenDialogReturnValue, shell } from "electron";
import { writeFile } from "fs";
import { join } from "path";
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
            console.log("\nRecived Message From Renderer to create user\n", event.sender.id, data);
            try {
                response = await this.dbmgmt.createUser(data.name, data.phone, data.address);
            } catch (err1) {
                err = err1;
            }
            event.sender.send("create-user", err, response.result);
        });

        ipcMain.on("create-group", async (event, data: createGroupFields) => {
            let err: sqliteError;
            let response: { result: any; success?: boolean; };
            console.log("Recived message from Renderer to create group", event.sender.id, data);
            try {
                response = await this.dbmgmt.createGroup(data.year, data.month, data.batch, data.members);
            } catch (err1) {
                err = err1;
            }
            event.sender.send("create-group", err, response.result);
        });

        ipcMain.on("get-users-data", async event => {
            console.log("Recived message from renderer to get users data");
            const result: userInfo[] = await this.dbmgmt.listUsers();
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
            console.log("Checking existance of phone number " + phone);
            try {
                result = await this.dbmgmt.checkPhone(phone);
            } catch (e) {
                err = e;
            }
            console.log("Phone number " + (result ? "" : "does not ") + "exists");
            event.sender.send("phone-exists", err, result);
        });

        ipcMain.on("batch-exists", async (event, batch: string, month: number, year: number) => {
            let err: sqliteError;
            let result: boolean;
            console.log("Checking existance of Batch  " + batch + " in month " + month);
            try {
                result = await this.dbmgmt.checkBatch(batch, month, year);
            } catch (e) {
                err = e;
            }
            console.log("Batch " + (result ? "" : "does not ") + "exists");
            event.sender.send("batch-exists", err, result);
        });


        ipcMain.on("show-message-box", (event, options: MessageBoxOptions) => {
            dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender), options);
        });

        ipcMain.on("show-dialog", async (event, type: ("open" | "messagebox"), options: (OpenDialogOptions | MessageBoxOptions)) => {
            let ret:(OpenDialogReturnValue|MessageBoxReturnValue);
            switch (type) {
                case "open":
                    ret = await dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), <OpenDialogOptions>options);
                    break;
                case "messagebox":
                    ret = await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender), <MessageBoxOptions>options);
                    break;
            };
            event.sender.send("show-dialog", ret);
        });

        ipcMain.on("open-external", (event, url: string) => {
            shell.openExternal(url);
        });

        ipcMain.on("get-config", event => {
            event.returnValue = global.config;
        });

        ipcMain.on("update-config", (event, newConfig: Configuration) => {
            console.log("Updating Configuration file ...");
            writeFile(newConfig.configPath, JSON.stringify(newConfig), (err) => {
                if (err) {
                    event.sender.send("update-config", false);
                    throw err;
                };
                if(!newConfig.databaseFile.isCustom)newConfig.databaseFile.location = join(app.getPath("userData"), "./main.db");
                //console.log(global.config.databaseFile.location, newConfig.databaseFile.location);
                if(global.config.databaseFile.location !== newConfig.databaseFile.location ){
                    dialog.showMessageBox({
                        message:"Looks like you have changed the database file. The app must restart to use the new database. The app will restart in 10 seconds",
                        title:"Database file changed"
                    });
                    setTimeout(function(){
                        app.quit();
                    }, 10000);
                }
                global.config = newConfig;
                event.sender.send("update-config", true);
            });
        });
    }
}

export default Ipchosts;