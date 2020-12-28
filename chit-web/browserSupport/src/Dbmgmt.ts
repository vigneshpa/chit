class Dbmgmt {
  db: any;
  dbFile: string;
  today: Date;
  constructor(dbFile: string, chitDB: ChitDatabase){};
  async connect(): Promise<boolean>{
    return true;
  };
  async createDB(): Promise<void>{};
  async closeDB(): Promise<void>{};
  async checkPhone(phone: string): Promise<boolean>{
    return true;
  };
  async createUser(userName: string, phone: string, address?: string): Promise<{
      success: boolean;
      result: createUserFields;
  }>{
    return {success:true, result:""};
  };
  async checkBatch(batch: string, month: number, year: number): Promise<boolean>{};
  async createGroup(year: number, month: number, batch: string, members: {
      UID: number;
      no_of_chits: number;
  }[]): Promise<{
      success: boolean;
      result: createGroupFields;
  }>{};
  async listUsers(): Promise<userInfo[]>{};
  async listGroups(): Promise<GroupInfo[]>{};
  async userDetails(UID: number): Promise<userInfoExtended>{};
  async analyseDB(): Promise<void>{};
}
export default Dbmgmt;