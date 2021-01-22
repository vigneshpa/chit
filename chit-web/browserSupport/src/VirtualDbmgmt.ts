export default class VirtualDbmgmt implements DbmgmtInterface {
  dbws: WebSocket;
  socketAddress: string;
  constructor() {
  };
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socketAddress = location?.host?(((location.protocol === "http:") ? "ws" : "wss") + "://" + location.host + "/api/dbmgmt"):"ws://localhost:3000/dbmgmt";
      console.log("Web socket address", this.socketAddress);
      this.dbws = new WebSocket(this.socketAddress);
      this.dbws.onopen = e => resolve();
      this.dbws.onerror = e => console.log(e);
    });
  };
  async close(): Promise<void> {
    this.dbws.close();
  };
  private delayedSend(args:string){
    this.dbws.addEventListener("open", ev=> this.dbws.send(args));
  }
  runQuery(args1:DbmgmtQueryArgs): Promise<DbmgmtQueryArgs["ret"]> {
    return new Promise((resolve, reject) => {
      let args:DbmgmtQueryArgs&{queryId?:number} = args1;
      const queryId = Math.floor(Math.random() * (10 ** 5));
      args.queryId = queryId;
      if(this.dbws.readyState !== 1){
        this.delayedSend(JSON.stringify(args));
      }else this.dbws.send(JSON.stringify(args));
      this.dbws.addEventListener("message", (ev) => {
        let data = JSON.parse(ev.data);
        if (data.queryId === queryId) {
          resolve(data.reply);
        }
      });
    });
  };
}