interface createUserFields{
    UID?:number;
    name:string;
    phone:string;
    address?:string;
}
interface userInfo{
    UID?:number;
    name:string;
    phone:string;
    address?:string;
    groups?:number[];
    cheats:cheatInfo[];
}
interface cheatInfo{
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
    members?:{UID:number;noOfCheats:number}[];
    winners?:Array<number>;
}
interface sqliteError extends Error{
    errno?:number;
}