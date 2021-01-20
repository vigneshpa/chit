type argsD = { query: string;[key: string]: any };
type ChitORM = any;
export default class Dbmgmt {
  readonly orm: ChitORM;
  today:Date;
  dbws: WebSocket;
  socketAddress: string;
  constructor(orm?: ChitORM) {
    this.today = new Date();
    this.orm = orm;
  };
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socketAddress = location?.host?(((location.protocol === "http:") ? "ws" : "wss") + "://" + location.host + "/api/dbmgmt"):"ws://localhost:3000/dbmgmt";
      console.log("Web socket address", this.socketAddress);
      this.dbws = new WebSocket(this.socketAddress);
      this.dbws.onopen = e => resolve(true);
      this.dbws.onerror = e => console.log(e);
    });
  };
  async closeDB(): Promise<void> {
    this.dbws.close();
  };
  runQuery(args: argsD): Promise<any> {
    return new Promise((resolve, reject) => {
      const queryId = Math.floor(Math.random() * (10 ** 10));
      args.queryId = queryId;
      this.dbws.send(JSON.stringify(args));
      this.dbws.addEventListener("message", (ev) => {
        let data = JSON.parse(ev.data);
        if (data.queryId === queryId) {
          resolve(data.reply);
        }
      });
    });
  };
}