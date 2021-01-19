import Vuetify from "vuetify/lib";
import "chit-common";
import { IpciRenderer } from "chit-common";

declare global {
    interface Window {
        ipcirenderer: IpciRenderer;
        ipcrenderer:ChitIpcRenderer;
        app: Vue;
        vuetify:Vuetify;
        config:Configuration;
        openExternal:(url:string)=>Void;
    }
    interface State {
        darkmode: any;
        appLoading: boolean;
        config:Configuration;
    }
}