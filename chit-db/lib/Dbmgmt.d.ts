import Database from "./sqlite3";
import "chit-types";
declare class Dbmgmt {
    db: Database;
    dbFile: string;
    today: Date;
    constructor(dbFile: string);
    connect(): Promise<boolean>;
    createDB(): Promise<void>;
    closeDB(): Promise<void>;
    checkPhone(phone: string): Promise<boolean>;
    createUser(userName: string, phone: string, address?: string): Promise<{
        success: boolean;
        result: createUserFields;
    }>;
    checkBatch(batch: string, month: number, year: number): Promise<boolean>;
    createGroup(year: number, month: number, batch: string, members: {
        UID: number;
        no_of_chits: number;
    }[]): Promise<{
        success: boolean;
        result: createGroupFields;
    }>;
    listUsers(): Promise<userInfo[]>;
    listGroups(): Promise<GroupInfo[]>;
    userDetails(UID: number): Promise<userInfoExtended>;
    analyseDB(): Promise<void>;
}
export default Dbmgmt;
