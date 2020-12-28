class Dbmgmt {
  db: ChitDatabase;
  dbFile: string;
  today: Date;
  ws: WebSocket;
  constructor(dbFile: string) {
    this.dbFile = dbFile;
    this.today = new Date();
  };
  async connect(): Promise<boolean> {
    this.ws = new WebSocket("/dbSocket", "ws");
    return true;
  };
  async createDB(): Promise<void> {
    return;
  };
  async closeDB(): Promise<void> {
    return;
  };
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
  runQuery(query: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, rejsect) => {
      let reqId = Math.floor(Math.random() * 10);
      this.ws.send(JSON.stringify({ query, args, reqId }));
      this.ws.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if(data.reqId === reqId)resolve(data);
      };
    });
  };
}
export default Dbmgmt;