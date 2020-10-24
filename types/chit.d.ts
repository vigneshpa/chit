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
    members?:{UID:number;no_of_chits:number}[];
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
// interface userInfoExtended{
//     UID:number;
//     name:string;
//     phone:string;
//     address:string;
//     noOfActiveBatches:number;
//     totalNoChits:number;
//     withdrawedChits:number;
//     groups:number[];
//     chits:ChitInfoExtended[];
//     oldChits:ChitInfoExtended[];
//     unpaid:any[];
// }
interface GroupInfo{
    GID:number;
    name:string;
    month:number;
    year:number;
    batch:string;
}
interface GroupInfoExtended{
    GID:number;
    name:string;
    month:number;
    year:number;
    batch:string;
    members:ChitInfoWithPayments[];
}
interface ChitInfo{
    CID:number;
    GID:number;
    UID:number;
    no_of_chits:number;
}
// interface ChitInfoWithGroup{
//     CID:number;
//     GID:number;
//     UID:number;
//     name:string;
//     month:number;
//     year:number;
//     batch:string;
// }
interface ChitInfoWithPayments{
    CID:number;
    GID:number;
    UID:number;
    no_of_chits:number
    payments:{
        month:number;
        to_be_paid:number;
        isPaid:boolean;
    }[];
}
interface Payments{
    PID:number;
    CID:number;
    to_be_paid:number;
    is_paid:number;
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