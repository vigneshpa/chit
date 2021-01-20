import { IpciMain, IpciRenderer, IpciWebcontents } from "chit-common";

export default class Ipci {
    main: IpciMain;
    renderer: IpciRenderer;
    ipcMain: ChitIpcMain;
    ipcRenderer: ChitIpcRenderer;
    mainEventHandlers: Record<string, ((sender: IpciWebcontents, args?: Record<string, any>) => Promise<any>)>;
    rendererEventHandlers: Record<string, ((sender: IpciRenderer, args?: Record<string, any>) => Promise<any>)>;
    constructor() {
        this.mainEventHandlers = {};
        this.rendererEventHandlers = {};
        let main: IpciMain = {
            on: (method: string, cb) => {
                if (this.mainEventHandlers[method]) this.mainEventHandlers[method] = cb;
            }
        };
        let webContents: IpciWebcontents = {
            id: 1,
            /**
            * WARNING: This method may cause memory leak!
            * Try not to use it.
            * (i.e.)Don't request anything from renderer!
            */
            call: async (method: string, args?: Record<string, any>) => {
                return this.rendererEventHandlers[method] ? (await this.rendererEventHandlers[method](renderer, args)) : false;
            }
        };
        let renderer: IpciRenderer = {
            /**
            * WARNING: This method may cause memory leak!
            * Try not to use it.
            * (i.e.)Don't respond to any request from main!
            */
            on: (method: string, cb) => {
                if (this.rendererEventHandlers[method]) this.rendererEventHandlers[method] = cb;
            },
            call: async (method: string, args) => {
                return this.mainEventHandlers[method] ? (await this.mainEventHandlers[method](webContents, args)) : false;
            }
        };
        this.main = main;
        this.renderer = renderer;
    }
}