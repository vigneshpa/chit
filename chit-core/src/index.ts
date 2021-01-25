import { IpciM, IpciR, IpciWC } from "./vendorTypes";
import * as moment from "moment";
declare global {

    interface ModelD {
        uuid: string;
        createdAt: Date;
        updatedAt: Date;
    }
    interface UserD extends ModelD {
        name: string;
        phone: string;
        address: string;
        chits: ChitD[];
    }
    interface ChitD extends ModelD {
        user: UserD;
        noOfChits: number;
        group: GroupD;
        payments: PaymentD[];
        wonAtMonth: RangeOf2<1, 20>;
    }
    interface GroupD extends ModelD {
        name: string;
        batch: string;
        month: RangeOf2<1, 12>;
        year: number;
        chits: ChitD[];
        /**
         * THIS IS ONLY FOR CREATION OF GROUP
         * array of members' uuid(s) and noOfChits
         */
        members?: { uuid: string; noOfChits: number; }[];
    }
    interface PaymentD extends ModelD {
        ispaid: boolean;
        chit: ChitD;
        imonth: RangeOf2<1, 20>;
        toBePaid: number;
        user: UserD;
    }

    type mainMethodMap = {
        dbQuery: (args: DbmgmtQueryArgs) => DbmgmtQueryArgs["ret"];
    } & Partial<PlatformFunctions>;
    type rendererMethodMap = {}

    type IpciMain = IpciM<mainMethodMap, rendererMethodMap>;
    type IpciRenderer = IpciR<rendererMethodMap, mainMethodMap>;
    type IpciWebcontents = IpciWC<mainMethodMap, rendererMethodMap>;

    interface Configuration {
        isDevelopement: boolean;
        theme: ('system' | 'dark' | 'light');
        configPath: string;
        databaseFile: {
            isCustom?: boolean;
            location?: string;
        },
        updates: {
            autoCheck: boolean;
            autoDownload: boolean;
        },
        vueApp: string;
        locale:string;
    }
}
import Dbmgmt from "./Dbmgmt";
export { Dbmgmt };
import Ipchost from "./Ipchost";
export { Ipchost };