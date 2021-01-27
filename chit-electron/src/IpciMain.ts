import { IpcMain, WebContents } from "electron";

export default class IpciMainElectron implements IpciMain {
    private ipc: IpcMain;
    handlers: IpciMain["handlers"];
    constructor(ipc: IpcMain) {
        this.ipc = ipc;
    }
    init(handlers: IpciMain["handlers"]) {
        this.handlers = handlers;
        this.ipc.handle("ipci-methods", async (event, args) => {
            return await this.handlers[args.method](this.getIpciWC(event.sender), args.args);
        });
    };
    private getIpciWC(sender:WebContents): IpciWebcontents {
        return {
            callMethod:(method: keyof IpciRenderer["handlers"], args: any)=> {
                return new Promise(resolve => {
                    const methodID = Math.floor(Math.random() * (10 ** 10));
                    sender.send("ipci-methods", { methodID, args, method });
                    this.ipc.on("ipci-methods-ret", (event, args)=>{
                        if(args.methodID === methodID){
                            resolve(args.ret);
                        }
                    });
                });
            }
        } as IpciWebcontents;
    };
}
