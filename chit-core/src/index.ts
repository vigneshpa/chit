import "./vendorTypes";
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
    }
    interface GroupD extends ModelD {
        name: string;
        batch: string;
        month: number;
        year: number;
        chits: ChitD[];
        winners: {
            [imonth: number]: string[];
        }
        /**
         * THIS IS ONLY FOR CREATION OF GROUP
         * array of members' uuid(s) and noOfChits
         */
        members?: { uuid: string; noOfChits: number; }[];
    }
    interface PaymentD extends ModelD {
        ispaid: boolean;
        chit: ChitD;
        imonth: number;
        toBePaid: number;
        user: UserD;
    }

    interface IpciMain {
        init: (handlers?: IpciMain["handlers"]) => any;
        handlers: { [method: string]: (sender: IpciWebcontents, args: Record<string, any>) => Promise<any> };
        bindHandler: (method: string, handler: (sender: IpciWebcontents, args: Record<string, any>) => Promise<any>) => void;
    }
    interface IpciRenderer {
        init: (handlers?: IpciRenderer["handlers"]) => any;
        handlers: { [method: string]: (sender: IpciRenderer, args: Record<string, any>) => Promise<any> };
        bindHandler: (method: string, handler: (sender: IpciRenderer, args: Record<string, any>) => Promise<any>) => void;

        call: (method: string, args: Record<string, any>) => Promise<any>;
    }
    interface IpciWebcontents {
        init: (handlers?: IpciWebcontents["handlers"]) => any;
        handlers: { [method: string]: (sender: IpciWebcontents, args: Record<string, any>) => Promise<any> };
        bindHandler: (method: string, handler: (sender: IpciWebcontents, args: Record<string, any>) => Promise<any>) => void;

        call: (method: string, args: Record<string, any>) => Promise<any>;
    }

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
        vueApp: string
    }
}

import Dbmgmt from "./Dbmgmt";
export { Dbmgmt };