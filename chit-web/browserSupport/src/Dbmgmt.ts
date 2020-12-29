class Dbmgmt {
  db: ChitDatabase;
  dbFile: string;
  today: Date;
  constructor(dbFile: string, chitDB?: ChitDatabase){};
  async connect(): Promise<boolean>{
    return true;
  };
  async createDB(): Promise<void>{};
  async closeDB(): Promise<void>{};
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
  async runQuery(query: string, ...args: any[]): Promise<any>{};
}
export default Dbmgmt;