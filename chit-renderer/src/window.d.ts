import Vuetify from "vuetify/lib";
import "chit-common";

declare global {
    interface Window {
        ipcrenderer: ChitIpcRenderer;
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