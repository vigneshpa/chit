import ChitORM from "chitorm";
class Dbmgmt {
  orm: ChitORM;
  socket: WebSocket;
  socketAddress: string;
  dbFile:string;
  today:Date;
  constructor(dbFile: string, orm?: ChitORM) {
    this.orm = orm;
    this.dbFile = dbFile;
  };
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socketAddress = (location.protocol === "http:") ? "ws" : "wss" + "://" + location.host + "/api/dbmgmt";
      console.log("Web socket address", this.socketAddress);
      this.socket = new WebSocket(this.socketAddress);
      this.socket.onopen = (e) => {
        resolve(true);
      };
      this.socket.onerror = (e) => { throw e; };
    });
  };
  async createDB(): Promise<void> { return; };
  async closeDB(): Promise<void> { return; };
  runQuery(query: "checkPhone", phone: string): Promise<boolean>;
  runQuery(query: "createUser", userName: string, phone: string, address?: string): Promise<{
    success: boolean;
    result: UserD;
  }>;
  runQuery(query: "checkBatch", batch: string, month: number, year: number): Promise<boolean>;
  runQuery(query: "createGroup", year: number, month: number, batch: string, members: {
    UID: number;
    no_of_chits: number;
  }[]): Promise<{
    success: boolean;
    result: GroupD;
  }>;
  runQuery(query: "listUsers"): Promise<UserD[]>;
  runQuery(query: "listGroups"): Promise<GroupD[]>;
  runQuery(query: "userDetails", UID: string): Promise<UserD>;
  async runQuery(query: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const queryId = Math.floor(Math.random() * (10 ** 10));
      this.socket.send(JSON.stringify({ query, args, queryId }));
      this.socket.addEventListener("message", (ev) => {
        let data = JSON.parse(ev.data);
        if (data.queryId === queryId) {
          resolve(data.reply);
        }
      });
    });
  };
}
export default Dbmgmt;