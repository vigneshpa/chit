interface createUserFields{
    UID?:number;
    name:string;
    phone:string;
    address?:string;
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
interface userInfo{
    UID:number;
    name:string;
    phone:string;
    address:string;
    groups:number[];
    chits:ChitInfo[];
}
interface userInfoExtended{
    UID:number;
    name:string;
    phone:string;
    address:string;
    noOfActiveBatches:number;
    totalNoChits:number;
    withdrawedChits:number;
    groups:number[];
    chits:ChitInfoExtended[];
    oldChits:ChitInfoExtended[];
    unpaid:any[];
}
interface GroupInfo{
    GID:number;
    name:string;
    month:number;
    year:number;
    batch:string;
    winners:Array<number>;
}
interface ChitInfo{
    CID:number;
    GID:number;
    UID:number;
    [monthi:string]:number|boolean;
}
interface ChitInfoWithGroup{
    CID:number;
    GID:number;
    UID:number;
    name:string;
    month:number;
    year:number;
    batch:string;
    [monthi:string]:number|boolean|string;
}
interface ChitInfoExtended{
    CID:number;
    GID:number;
    UID:number;
    name:string;
    month:number;
    year:number;
    batch:string;
    payments:{
        month:number;
        toBePaid:number;
        isPaid:boolean;
    }[];
}
interface sqliteError extends Error{
    errno?:number;
}
interface Configuration{
    isDevelopement:boolean;
    theme:('system'|'dark'|'light');
    configPath:string;
    databaseFile:{
        isCustom?:boolean;
        location?:string;
    }
}