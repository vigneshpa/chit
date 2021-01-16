type argsD = { query: string;[key: string]: any };
type ChitORM = any;
export default class Dbmgmt {
  readonly orm: ChitORM;
  today:Date;
  socket: WebSocket;
  socketAddress: string;
  constructor(orm?: ChitORM) {
    this.today = new Date();
    this.orm = orm;
  };
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socketAddress = ((location.protocol === "http:") ? "ws" : "wss") + "://" + location.host + "/api/dbmgmt";
      console.log("Web socket address", this.socketAddress);
      this.socket = new WebSocket(this.socketAddress);
      this.socket.onopen = e => resolve(true);
      this.socket.onerror = e => console.log(e);
    });
  };
  async closeDB(): Promise<void> {
    this.socket.close();
  };
  runQuery(args: argsD): Promise<any> {
    return new Promise((resolve, reject) => {
      const queryId = Math.floor(Math.random() * (10 ** 10));
      args.queryId = queryId;
      this.socket.send(JSON.stringify(args));
      this.socket.addEventListener("message", (ev) => {
        let data = JSON.parse(ev.data);
        if (data.queryId === queryId) {
          resolve(data.reply);
        }
      });
    });
  };
}
export { };