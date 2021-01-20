import { type } from "os";
import Dbmgmt from "./Dbmgmt";

declare global {
    type PlatformFunctions = {
        updateConfig: (newConfig: Configuration) => void;
        pingRecived: () => void;
        showMessageBox: (options: ChitMessageBoxOptions, sender: IpciWebcontents) => number;
        showOpenDialog: (options: ChitOpenDialogOptions, sender: IpciWebcontents) => ChitOpenDialogReturnValue;
        openExternal: (url: string) => any;
    }
    type pfPromisified = { [K in keyof PlatformFunctions]: (...p: Parameters<PlatformFunctions[K]>) => ReturnType<PlatformFunctions[K]> }
}
export default class Ipchost {
    ipc: IpciMain;
    dbmgmt: Dbmgmt;
    pf: PlatformFunctions;
    constructor(ipciMain: IpciMain, dbmgmt: Dbmgmt, pf: pfPromisified) {
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
                handler[key] = (sender, ...args) => this.pf[key](...args);
            }
        }
        this.ipc.init(handler);
    }
}