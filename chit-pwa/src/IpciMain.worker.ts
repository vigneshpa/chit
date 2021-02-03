export default class IpciMainPWA implements IpciMain {
    handlers: IpciMain["handlers"];
    constructor(){};
    init(handlers: IpciMain["handlers"]) {
        this.handlers = handlers;
        self.addEventListener("message", async (e:MessageEvent) => {
            if (e.data?.ipci && e.data.channel === "ipci-methods") {
                const payload = e.data.payload;
                const ret = await this.handlers[payload.method](this.webContentsPWA, payload.args);
                self.postMessage({
                  ipci: true,
                  channel: "ipci-methods-ret",
                  payload: {
                    methodID: payload.methodID,
                    ret
                  }
                });
              }
        });
    };
    private webContentsPWA:IpciWebcontents = {
        callMethod:(method: keyof IpciRenderer["handlers"], args: any)=> {
            return new Promise(resolve => {
                const methodID = Math.floor(Math.random() * (10 ** 10));
                self.postMessage({ipci:true, channel:"ipci-methods", payload:{ methodID, args, method }});
                const listener = async (e:MessageEvent)=>{
                    if(e.data?.ipci && e.data.channel === "ipci-methods-ret" && e.data.payload.methodID === methodID){
                        resolve(e.data.payload.ret);
                        self.removeEventListener("message", listener);
                    }
                };
                self.addEventListener("message", listener);
            });
        }
    }
}