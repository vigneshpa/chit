import {} from "chitcore";
import { IpcRenderer } from "electron";
export default class IpciRendererElectron implements IpciRenderer{
    handlers:IpciRenderer["handlers"];
    ipc:IpcRenderer;
    constructor(ipc:IpcRenderer){
        this.ipc = ipc;
    }
    init(handlers:IpciRenderer["handlers"]){
        this.handlers = handlers;
        this.ipc.on("ipci-methods", async (ev, args)=>{
            const ret = await this.handlers[args.method](this, args.args);
            this.ipc.send("ipci-methods-ret", {methodID:args.methodID, ret});
        });
    };
    async callMethod(method:keyof IpciMain["handlers"], args?:any){
        return await this.ipc.invoke("ipci-methods", {method, args});
    };
}