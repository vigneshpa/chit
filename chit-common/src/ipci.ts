export class IpciMain {
    private ipc: ChitIpcMain;
    constructor(ipcMain: ChitIpcMain) {
        this.ipc = ipcMain;
    }
    public on(method: string, callBack: (
        /**
         * Try not to use this parameter
         */
        sender: IpciWebcontents,
        args?: Record<string, any>) => Promise<any>): void {
        this.ipc.on("ipci-methods-" + method as "ipci-methods", async (event, argsR) => {
            let ret = await callBack(new IpciWebcontents(event.sender, this.ipc), argsR.args);
            event.sender.send("ipci-methods-" + method as "ipci-methods-ret", { ret, methodID: argsR.methodID })
        });
    }
}
export class IpciWebcontents {
    private ipcWebContents: ChitIpcMainWebcontents;
    private ipcMain: ChitIpcMain;
    public id: number;
    constructor(ipcWebContents: ChitIpcMainWebcontents, ipcMain:ChitIpcMain) {
        this.ipcWebContents = ipcWebContents;
        this.id = ipcWebContents.id;
        this.ipcMain = ipcMain;
    }
    /**
     * WARNING: This method may cause memory leak!
     * Try not to use it.
     * (i.e.)Don't request anything from renderer!
     */
    public call(method: string, args?: Record<string, any>): Promise<any> {
        const methodID = Math.floor(Math.random() * 10000);
        this.ipcWebContents.send("ipci-methods-" + method as "ipci-methods", { methodID, args });
        return new Promise((resolve, reject) => {
            const cb = (event: ChitIpcMainEvent, args1: {
                methodID: number;
                ret: any;
            }) => {
                if (args1.methodID === methodID) {
                    resolve(args1.ret);
                } else
                    this.ipcMain.once("ipci-methods-ret-" + method as "ipci-methods-ret", cb);
            }
            this.ipcMain.once("ipci-methods-ret-" + method as "ipci-methods-ret", cb);
        });
    }
}
export class IpciRenderer {
    private ipc: ChitIpcRenderer;
    constructor(ipcRenderer: ChitIpcRenderer) {
        this.ipc = ipcRenderer;
    }
    /**
     * WARNING: This method may cause memory leak!
     * Try not to use it.
     * (i.e.)Don't respond to any request from main!
     */
    public on(method: string, callBack: (sender: IpciRenderer, args?: Record<string, any>) => Promise<any>): void {
        this.ipc.on("ipci-methods-" + method as "ipci-methods", async (event, argsR) => {
            let ret = await callBack(this, argsR.args);
            event.sender.send("ipci-methods-" + method as "ipci-methods-ret", { ret, methodID: argsR.methodID })
        });
    }
    public call(method: string, args?: Record<string, any>): Promise<any> {
        const methodID = Math.floor(Math.random() * 10000);
        this.ipc.send("ipci-methods-" + method as "ipci-methods", { methodID, args });
        return new Promise((resolve, reject) => {
            const cb = (event: ChitIpcRendererEvent, args1: {
                methodID: number;
                ret: any;
            }) => {
                if (args1.methodID === methodID) {
                    resolve(args1.ret);
                } else
                    this.ipc.once("ipci-methods-ret-" + method as "ipci-methods-ret", cb);
            }
            this.ipc.once("ipci-methods-ret-" + method as "ipci-methods-ret", cb);
        });
    }
}