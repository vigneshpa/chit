import "./vendorTypes";
declare global {
    interface ModelD{
        uuid:string;
        createdAt:Date;
        updatedAt:Date;
    }
    interface UserD extends ModelD{
        name:string;
        phone:string;
        address:string;
        chits:ChitD[];
    }
    interface ChitD extends ModelD{
        user:UserD;
        noOfChits:number;
        group:GroupD;
        payments:PaymentD[];
    }
    interface GroupD extends ModelD{
        name:string;
        batch:string;
        month:number;
        year:number;
        chits:ChitD[];
        /**
         * THIS IS ONLY FOR CREATION OF GROUP
         * array of members' uuid(s) and noOfChits
         */
        members?:{uuid:string;noOfChits:number;}[];
    }
    interface PaymentD extends ModelD{
        ispaid:boolean;
        chit:ChitD;
        imonth:number;
        toBePaid:number;
        user:UserD;
    }
    interface sqliteError extends Error {
        errno?: number;
    }
    interface Configuration {
        isDevelopement: boolean;
        theme: ('system' | 'dark' | 'light');
        configPath: string;
        databaseFile: {
            isCustom?: boolean;
            location?: string;
        },
        updates: {
            autoCheck: boolean;
            autoDownload: boolean;
        },
        vueApp: string
    }
    interface ChitIpcRenderer {
        once: (channel: string, listener: (event: ChitIpcRendererEvent, ...args: any[]) => void) => ChitIpcRenderer;
        on: (channel: string, listener: (event: ChitIpcRendererEvent, ...args: any[]) => void) => ChitIpcRenderer;
        send(channel: string, ...args: any[]): void
        id: number;
    }
    interface ChitIpcMain {
        on: (channel: string, listener: (event: ChitIpcMainEvent, ...args: any[]) => void) => ChitIpcMain;
        once: (channel: string, listener: (event: ChitIpcMainEvent, ...args: any[]) => void) => ChitIpcMain;
    }
    interface ChitIpcMainEvent {
        sender: ChitIpcMainWebcontents,
        reply: Function
        returnValue?: any
    }
    interface ChitIpcMainWebcontents{
        send(channel: string, ...args: any[]): void
        id: number;
    }
    interface ChitIpcRendererEvent {
        sender: ChitIpcRenderer;
        senderId: number;
    }
}
import Dbmgmt from "./Dbmgmt";
import time from "./time";
import Ipchost from "./Ipchost";
export {time};
export {Dbmgmt};
export {Ipchost};