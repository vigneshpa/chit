import Dbmgmt from "./Dbmgmt";
export default class Ipchosts {
    public constructor(chitIpcMain: ChitIpcMain, dbmgmt: Dbmgmt, config: Configuration) {
        this.chitIpcMain = chitIpcMain;
        this.dbmgmt = dbmgmt;
        this.events = {};
        this.config = config;
    }
    private config: Configuration;
    private chitIpcMain: ChitIpcMain;
    private dbmgmt: Dbmgmt;
    private events: {
        openForm?: (type: string, args: Record<string, string>) => void;
        pingRecived?: () => void;
        showMessageBox?: (options: ChitMessageBoxOptions, sender: ChitIpcMainWebcontents) => Promise<any>;
        showOpenDialog?: (options: ChitOpenDialogOptions, sender: ChitIpcMainWebcontents) => Promise<ChitOpenDialogReturnValue>;
        openExternal?: (url: string) => any;
        updateConfig?: (newConfig: Configuration) => Promise<boolean>;
    }
    public on(key: "openForm", listener: (type: string, args: Record<string, string>) => void): void;
    public on(key: "pingRecived", listener: () => void): void;
    public on(key: "showMessageBox", listener: (options: ChitMessageBoxOptions, sender: ChitIpcMainWebcontents) => Promise<any>): void;
    public on(key: "showOpenDialog", listener: (options: ChitOpenDialogOptions, sender: ChitIpcMainWebcontents) => Promise<ChitOpenDialogReturnValue>): void;
    public on(key: "openExternal", listener: (url: string) => any): void;
    public on(key: "updateConfig", listener: (newConfig: Configuration) => Promise<boolean>): void;
    public on(key: keyof Ipchosts["events"], callback: (...args: any[]) => any): void {
        this.events[key] = callback;
    }
    public initialise(): void {
        this.chitIpcMain.on("ping", event => {
            console.log("Recived ping from renderer");
            console.log("Sending pong to the renderer");
            event.sender.send("pong");
            this.events?.pingRecived();
        });

        this.chitIpcMain.on("open-forms", (_event, type, args) => {
            this.events.openForm(type, args);
        });


        this.chitIpcMain.on("show-message-box", (event, options) => {
            this.events.showMessageBox(options, event.sender);
        });

        this.chitIpcMain.on("show-open-dialog", async (event, options) => {
            const ret = await this.events.showOpenDialog(options, event.sender);
            event.sender.send("show-open-dialog", ret);
        });

        this.chitIpcMain.on("open-external", (_event, url) => {
            this.events.openExternal(url);
        });

        this.chitIpcMain.on("get-config", event => {
            event.returnValue = this.config;
            return;
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
        this.chitIpcMain.on("db-query", async (event, args) => {
            let result = await this.dbmgmt.runQuery( args);
            event.sender.send(<"db-query">("db-query-"+args.query), result);
        });
    }
}