import { ipcMain} from "electron";
declare global {
    namespace NodeJS {
        interface Global {
            config: Configuration;
        }
    }
    interface IpcM{
        on:(channel: string, listener: (event:{
            sender:any;
            reply:Function;
            returnValue:any;
        }, ...args: any[]) => void)=>IpcM;
        once:(channel: string, listener: (event:{
            sender:any;
            reply:Function;
            returnValue:any;
        }, ...args: any[]) => void)=>IpcM;
    }
}
export { };