export default class IpciRendererPWA implements IpciRenderer {
  handlers: IpciRenderer["handlers"];
  worker: Worker;
  pf:pfPromisified;
  constructor(wkr: Worker, pf:pfPromisified) {
    this.worker = wkr;
    this.pf = pf;
  }
  init(handlers: IpciRenderer["handlers"]) {
    this.handlers = handlers;
    this.worker.addEventListener("message", async e => {
      if (e.data?.ipci && e.data.channel === "ipci-methods") {
        const payload = e.data.payload;
        const ret = await this.handlers[payload.method](this, payload.args);
        this.worker.postMessage({
          ipci: true,
          channel: "ipci-methods-ret",
          payload: {
            methodID: payload.methodID,
            ret
          }
        });
      }
    })
  };
  callMethod(method: keyof IpciMain["handlers"], args?: any) {
    if(this.pf.hasOwnProperty(method))return this.pf[method](args);
    return new Promise((resolve:(ret:any)=>void) => {
      const methodID = Math.floor(Math.random() * (10 ** 10));
      this.worker.postMessage({
        ipci: true,
        channel: "ipci-methods",
        payload: { method, args, methodID }
      });
      const listener = async (e: MessageEvent<any>) => {
        if (e.data?.ipci && e.data.channel === "ipci-methods-ret" && e.data.payload.methodID === methodID) {
          resolve(e.data.payload.ret)
          this.worker.removeEventListener("message", listener);
        }
      };
      this.worker.addEventListener("message", listener);
    });
  };
}