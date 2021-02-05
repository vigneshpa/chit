declare global {
    interface ChitMessageBoxOptions{
        title?:string;
        message:string;
        type?:"info"|"error";
        detail?:string;
    }
    type PlatformFunctions = {
        updateConfig: (newConfig: Configuration) => void;
        ping: () => void;
        //This can be handled with window.open but it is kept for electron
        openExternal: (url: string) => void;
    }
    type pfPromisified = { [K in keyof PlatformFunctions]: (...p: Parameters<PlatformFunctions[K]>) => Promise<ReturnType<PlatformFunctions[K]>> }
}
export default class Ipchost {
    ipc: IpciMain;
    dbmgmt: DbmgmtInterface;
    pf: pfPromisified;
    constructor(ipciMain: IpciMain, dbmgmt: DbmgmtInterface, pf: pfPromisified) {
        this.ipc = ipciMain;
        this.dbmgmt = dbmgmt;
        this.pf = pf;
    }
    init() {
        const handler: IpciMain["handlers"] = {
            dbQuery: (sender, args) => {
                return this.dbmgmt.runQuery(args);
            }
        };
        for (const key in this.pf) {
            if (Object.prototype.hasOwnProperty.call(this.pf, key)) {
                (handler[key as keyof PlatformFunctions] as any) = async (sender:any, ...args:any[]) => await this.pf[key as keyof PlatformFunctions](...args);
            }
        }
        this.ipc.init(handler);
    }
}