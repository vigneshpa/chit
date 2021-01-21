import { type } from "os";

declare global {
    type PlatformFunctions = {
        updateConfig: (newConfig: Configuration) => void;
        ping: () => void;
        showMessageBox: (options: ChitMessageBoxOptions, sender: IpciWebcontents) => number;
        showOpenDialog: (options: ChitOpenDialogOptions, sender: IpciWebcontents) => ChitOpenDialogReturnValue;
        openExternal: (url: string) => void;
    }
    type pfPromisified = { [K in keyof PlatformFunctions]: (...p: Parameters<PlatformFunctions[K]>) => Promise<ReturnType<PlatformFunctions[K]>> }
}
export default class Ipchost {
    ipc: IpciMain;
    dbmgmt: DbmgmtInterface;
    pf: pfPromisified;
    config:Configuration
    constructor(ipciMain: IpciMain, dbmgmt: DbmgmtInterface, pf: pfPromisified, config:Configuration) {
        this.ipc = ipciMain;
        this.dbmgmt = dbmgmt;
        this.pf = pf;
        this.config = config;
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