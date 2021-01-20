import Dbmgmt from "./Dbmgmt";

declare global {
    interface PlatformFunctions {
        updateConfig: (newConfig: Configuration) => Promise<void>;
        pingRecived: () => void;
        showMessageBox: (options: ChitMessageBoxOptions, sender: IpciWebcontents) => Promise<any>;
        showOpenDialog: (options: ChitOpenDialogOptions, sender: IpciWebcontents) => Promise<ChitOpenDialogReturnValue>;
        openExternal: (url: string) => any;
    }
}
export default class Ipchost {
    ipc:IpciMain;
    dbmgmt:Dbmgmt;
    constructor(ipciMain:IpciMain, dbmgmt:Dbmgmt, pf:PlatformFunctions){
        this.ipc = ipciMain;
        this.dbmgmt = dbmgmt;
    }
    init(){
        this.ipc.init({
            dbQuery:(sender, args)=>{
                return this.dbmgmt.runQuery(args);
            }
        });
    }
}