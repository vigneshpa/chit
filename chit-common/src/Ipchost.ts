import Dbmgmt from "./Dbmgmt";
export default class Ipchosts {
    constructor(chitIpcMain: ChitIpcMain, dbmgmt: Dbmgmt, config: Configuration) {
        this.chitIpcMain = chitIpcMain;
        this.dbmgmt = dbmgmt;
        this.events = {};
        this.config = config;
    }
    private config: Configuration;
    private chitIpcMain: ChitIpcMain;
    private dbmgmt: Dbmgmt;
    private events: {
        "openForm"?: (type: string, args: { [key: string]: string }) => void;
        "pingRecived"?: () => void;
        "showMessageBox"?: (options: ChitMessageBoxOptions, sender:ChitIpcMainWebcontents) => Promise<any>;
        "showOpenDialog"?: (options: ChitOpenDialogOptions, sender:ChitIpcMainWebcontents) => Promise<ChitOpenDialogReturnValue>;
        "openExternal"?: (url: string) => any;
        "updateConfig"?: (newConfig: Configuration) => Promise<boolean>;
    }
    public on(key: "openForm", listener: (type: string, args: { [key: string]: string }) => void): void;
    public on(key: "pingRecived", listener: () => void): void;
    public on(key: "showMessageBox", listener: (options: ChitMessageBoxOptions, sender:ChitIpcMainWebcontents) => Promise<any>): void;
    public on(key: "showOpenDialog", listener: (options: ChitOpenDialogOptions, sender:ChitIpcMainWebcontents) => Promise<ChitOpenDialogReturnValue>): void;
    public on(key: "openExternal", listener: (url: string) => any): void;
    public on(key: "updateConfig", listener: (newConfig: Configuration) => Promise<boolean>): void;
    public on(key: string, callback: (...args: any[]) => void): void {
        this.events[key] = callback;
    }
    initialise(): void {
        this.chitIpcMain.on("ping", event => {
            console.log("Recived ping from renderer");
            console.log("Sending pong to the renderer");
            event.sender.send("pong");
            this.events.pingRecived();
        });

        this.chitIpcMain.on("create-user", async (event, data: createUserFields) => {
            let err: sqliteError;
            let response: { result: any; success?: boolean; };
            console.log("\nRecived Message From Renderer to create user\n", event.sender.id, data);
            try {
                response = await this.dbmgmt.runQuery("createUser", data.name, data.phone, data.address);
            } catch (err1) {
                err = err1;
            }
            event.sender.send("create-user", err, response?.result);
        });

        this.chitIpcMain.on("create-group", async (event, data: createGroupFields) => {
            let err: sqliteError;
            let response: { result: any; success?: boolean; };
            console.log("Recived message from Renderer to create group", event.sender.id, data);
            try {
                response = await this.dbmgmt.runQuery("createGroup", data.year, data.month, data.batch, data.members);
            } catch (err1) {
                err = err1;
            }
            event.sender.send("create-group", err, response?.result);
        });

        this.chitIpcMain.on("get-users-data", async event => {
            const result: userInfo[] = await this.dbmgmt.runQuery("listUsers");
            console.log("Sending users data to the renderer");
            event.sender.send("get-users-data", result);
        });

        this.chitIpcMain.on("get-user-details", async (event, UID: number) => {
            const result: userInfoExtended = await this.dbmgmt.runQuery("userDetails", UID);
            console.log("Sending " + result.name + "'s data to the renderer");
            event.sender.send("get-user-details", result);
        });

        this.chitIpcMain.on("get-groups-data", async event => {
            console.log("Recived message from renderer to get groups data");
            const result = await this.dbmgmt.runQuery("listGroups");
            console.log("Sending groups data to the renderer.");
            event.sender.send("get-groups-data", result);
        });

        this.chitIpcMain.on("open-forms", (event, type: string, args: { [key: string]: string }) => {
            this.events.openForm(type, args);
        });

        this.chitIpcMain.on("phone-exists", async (event, phone: string) => {
            let err: sqliteError;
            let result: boolean;
            console.log("Checking existance of phone number " + phone);
            try {
                result = await this.dbmgmt.runQuery("checkPhone", phone);
            } catch (e) {
                err = e;
            }
            console.log("Phone number " + (result ? "" : "does not ") + "exists");
            event.sender.send("phone-exists", err, result);
        });

        this.chitIpcMain.on("batch-exists", async (event, batch: string, month: number, year: number) => {
            let err: sqliteError;
            let result: boolean;
            console.log("Checking existance of Batch  " + batch + " in month " + month);
            try {
                result = await this.dbmgmt.runQuery("checkBatch", batch, month, year);
            } catch (e) {
                err = e;
            }
            console.log("Batch " + (result ? "" : "does not ") + "exists");
            event.sender.send("batch-exists", err, result);
        });


        this.chitIpcMain.on("show-message-box", (event, options) => {
            this.events.showMessageBox(options, event.sender);
        });

        this.chitIpcMain.on("show-dialog", async (event, type: ("open" | "messagebox"), options) => {
            let ret;
            switch (type) {
                case "open":
                    ret = await this.events.showOpenDialog(options, event.sender);
                    break;
                case "messagebox":
                    ret = await this.events.showMessageBox(options, event.sender);
                    break;
            };
            event.sender.send("show-dialog", ret);
        });

        this.chitIpcMain.on("open-external", (event, url: string) => {
            this.events.openExternal(url);
        });

        this.chitIpcMain.on("get-config", event => {
            event.returnValue = this.config;
        });

        this.chitIpcMain.on("update-config", async (event, newConfig: Configuration) => {
            console.log("Updating Configuration file ...");
            let done: boolean = false;
            try { done = await this.events.updateConfig(newConfig) } catch (e) {
                event.sender.send("update-config", done);
                throw e;
            }
            event.sender.send("update-config", done);
        });
        this.chitIpcMain.on("db-run-query", async (event, query: string, ...args) => {
            let result = await this.dbmgmt.runQuery(query, ...args);
            event.sender.send("db-run-query", result);
        });
    }
}