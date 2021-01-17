import Dbmgmt from "./Dbmgmt";
import { IpciMain, IpciWebcontents } from "./ipci";
export default class Ipchosts {
    public constructor(ipcMain: IpciMain, dbmgmt: Dbmgmt, config: Configuration) {
        this.ipciMain = ipcMain;
        this.dbmgmt = dbmgmt;
        this.events = {};
        this.config = config;
    }
    private config: Configuration;
    private ipciMain: IpciMain;
    private dbmgmt: Dbmgmt;
    private events: {
        pingRecived?: () => void;
        showMessageBox?: (options: ChitMessageBoxOptions, sender: IpciWebcontents) => Promise<any>;
        showOpenDialog?: (options: ChitOpenDialogOptions, sender: IpciWebcontents) => Promise<ChitOpenDialogReturnValue>;
        openExternal?: (url: string) => any;
        updateConfig?: (newConfig: Configuration) => Promise<boolean>;
    }
    public on(key: "pingRecived", listener: () => void): void;
    public on(key: "showMessageBox", listener: (options: ChitMessageBoxOptions, sender: IpciWebcontents) => Promise<any>): void;
    public on(key: "showOpenDialog", listener: (options: ChitOpenDialogOptions, sender: IpciWebcontents) => Promise<ChitOpenDialogReturnValue>): void;
    public on(key: "openExternal", listener: (url: string) => any): void;
    public on(key: "updateConfig", listener: (newConfig: Configuration) => Promise<boolean>): void;
    public on(key: keyof Ipchosts["events"], callback: (...args: any[]) => any): void {
        this.events[key] = callback;
    }
    public initialise(): void {
        this.ipciMain.on("ping", async (sender, args) => {
            return "pong";
        });

        this.ipciMain.on("show-message-box", async (sender, args) => this.events.showMessageBox(args.options, sender));

        this.ipciMain.on("show-open-dialog", (sender, args) => this.events.showOpenDialog(args.options, sender));

        this.ipciMain.on("open-external", (sender, args) =>this.events.openExternal(args.url));

        this.ipciMain.on("get-config", async (sender, args)=>this.config);

        this.ipciMain.on("update-config", async(sender, args)=>this.events.updateConfig(args.newConfig));

        this.ipciMain.on("db-query", (sender, args)=>this.dbmgmt.runQuery(args.args));
    }
}