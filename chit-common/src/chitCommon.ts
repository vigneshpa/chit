import "./vendorTypes";
declare global {
    interface createUserFields {
        UID?: number;
        name: string;
        phone: string;
        address?: string;
    }
    interface createGroupFields {
        GID?: number;
        name?: string;
        month: number;
        year: number;
        batch: string;
        members?: { UID: number; no_of_chits: number }[];
        winners?: Array<number>;
    }
    interface userInfo {
        UID: number;
        name: string;
        phone: string;
        address: string;
    }
    interface userInfoExtended {
        UID: number;
        name: string;
        phone: string;
        address: string;
        noOfActiveBatches: number;
        totalNoChits: number;
        withdrawedChits: number;
        groups: number[];
        chits: ChitInfo[];
        oldChits: ChitInfo[];
        unpaid: any[];
    }
    interface GroupInfo {
        GID: number;
        name: string;
        month: number;
        year: number;
        batch: string;
        winners: number[];
    }
    interface GroupInfoExtended {
        GID: number;
        name: string;
        month: number;
        year: number;
        batch: string;
        members: ChitInfo[];
    }
    interface ChitInfo {
        CID: number;
        GID: number;
        UID: number;
        no_of_chits: number;
        name: string;
        month: number;
        year: number;
        batch: string;
        payments: { month: number; to_be_paid: number; is_paid: boolean; }[];
    }
    interface ChitInfoRaw {
        CID: number;
        GID: number;
        UID: number;
        no_of_chits: number;
        name: string;
        month: number;
        year: number;
        batch: string;
    }
    interface Payments {
        PID: number;
        CID: number;
        to_be_paid: number;
        is_paid: number;
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
        sender: ChitIpcRenderer,
        reply: Function
        returnValue: any
    }
    interface ChitIpcRendererEvent {
        sender: ChitIpcMain,
        reply: Function
        returnValue: any
    }
}
import Dbmgmt from "./Dbmgmt";
import time from "./time";
import Ipchost from "./Ipchost";
export { Dbmgmt, time, Ipchost };