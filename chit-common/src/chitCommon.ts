import { ChitIpcM, ChitIpcR, ChitIpcMWebcontents, ChitIpcREvent, ChitIpcMEvent } from "./vendorTypes";
declare global {


    //ORM Entity definitions
    interface ModelD {
        uuid: string;
        createdAt: Date;
        updatedAt: Date;
    }
    interface UserD extends ModelD {
        name: string;
        phone: string;
        address: string;
        chits: ChitD[];
    }
    interface ChitD extends ModelD {
        user: UserD;
        noOfChits: number;
        group: GroupD;
        payments: PaymentD[];
    }
    interface GroupD extends ModelD {
        name: string;
        batch: string;
        month: number;
        year: number;
        chits: ChitD[];
        /**
         * THIS IS ONLY FOR CREATION OF GROUP
         * array of members' uuid(s) and noOfChits
         */
        members?: { uuid: string; noOfChits: number; }[];
    }
    interface PaymentD extends ModelD {
        ispaid: boolean;
        chit: ChitD;
        imonth: number;
        toBePaid: number;
        user: UserD;
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


    //IPC channel definitions
    interface ipcMainChannels {
        "ping": [];
        "open-forms": [type: string, args?: Record<string, string>];
        "show-message-box": [options: ChitMessageBoxOptions];
        "show-open-dialog": [options: ChitOpenDialogOptions];
        "open-external": [url: string];
        "get-config": [];
        "update-config": [newConfig: Configuration];
        "db-query": Parameters<Dbmgmt["runQuery"]>;

        "ipc": [data: { command: string, [key: string]: any }];
        "ipc-showMessageBox":[data:{ command: "showMessageBox", data:any }];
        "ipc-updateConfig":[data:{ command: "updateConfig" }];
    }
    interface ipcRendererChannels {
        "pong": [];
        "show-open-dialog": [ret: ChitOpenDialogReturnValue];
        "get-config": [config: Configuration];
        "update-config": [done: boolean];
        "db-query": [ret: Await<ReturnType<Dbmgmt["runQuery"]>>];
        "db-query-checkPhone": [ret: boolean];
        "db-query-createUser": [ret: UserD];
        "db-query-checkBatch": [ret: boolean];
        "db-query-createGroup": [ret: GroupD];
        "db-query-listGroups": [ret: GroupD[]];
        "db-query-listUsers": [ret: UserD[]];
        "db-query-userDetails": [ret: UserD];

        "ipc": [data: { command: string, [key: string]: any }];
    }
    type ChitIpcMain = ChitIpcM<ipcMainChannels, ipcRendererChannels>;
    type ChitIpcRenderer = ChitIpcR<ipcRendererChannels, ipcMainChannels>;
    type ChitIpcMainWebcontents = ChitIpcMWebcontents<ipcRendererChannels>;
    type ChitIpcRendererEvent = ChitIpcREvent<ipcRendererChannels, ipcMainChannels>;
    type ChitIpcMainEvent = ChitIpcMEvent<ipcRendererChannels>;
}
import Dbmgmt from "./Dbmgmt";
export { Dbmgmt };
import time from "./time";
export { time };
import Ipchost from "./Ipchost";
export { Ipchost };
import ChitORM from "./ChitORM";
export {ChitORM}