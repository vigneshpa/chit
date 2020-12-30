import { Socket } from "dgram";

class Dbmgmt {
  db: ChitDatabase;
  dbFile: string;
  today: Date;
  socket: WebSocket;
  constructor(dbFile: string, chitDB?: ChitDatabase) { };
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let socketAddress = "ws://"+location.host+"/api/dbmgmt";
      console.log("Web socket address", socketAddress);
      this.socket = new WebSocket(socketAddress);
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
    result: createUserFields;
  }>;
  runQuery(query: "checkBatch", batch: string, month: number, year: number): Promise<boolean>;
  runQuery(query: "createGroup", year: number, month: number, batch: string, members: {
    UID: number;
    no_of_chits: number;
  }[]): Promise<{
    success: boolean;
    result: createGroupFields;
  }>;
  runQuery(query: "listUsers"): Promise<userInfo[]>;
  runQuery(query: "listGroups"): Promise<GroupInfo[]>;
  runQuery(query: "userDetails", UID: number): Promise<userInfoExtended>;
  async runQuery(query: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const queryId = Math.floor(Math.random() * (10 ** 10));
      this.socket.send(JSON.stringify({ query, args, queryId }));
      this.socket.addEventListener("message", (ev) => {
        let data = JSON.parse(ev.data);
        if (data.queryId == queryId) {
          resolve(data.reply);
        }
      });
    });
  };
}
export default Dbmgmt;