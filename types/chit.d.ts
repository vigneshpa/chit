interface createUserFields{
    UID?:number;
    name:string;
    phone:string;
    address?:string;
}
interface userInfo{
    UID:number;
    name:string;
    phone:string;
    address?:string;
    groups?:number[];
    chits:chitInfo[];
}
interface chitInfo{
    CID:number;
    UID:number;
    GID:number;
    [month:string]:number|boolean;
}
interface createGroupFields{
    GID?:number;
    name?:string;
    month:number;
    year:number;
    batch:string;
    members?:{UID:number;noOfChits:number}[];
    winners?:Array<number>;
}
interface sqliteError extends Error{
    errno?:number;
}
interface Configuration{
    isDevelopement:boolean;
    theme:('system'|'dark'|'light');
}