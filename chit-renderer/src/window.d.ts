import Vuetify from "vuetify/lib";
import { Store } from "vuex";
import "chit-common";

declare global {
    interface Window {
        ipcrenderer: ChitIpcRenderer;
        app: Vue;
        store: Store<State>;
        vuetify:Vuetify;
        config:Configuration;
        openExternal:(url:string)=>Void;
        resizeWindowToCard:()=>Void;
    }
    interface State {
        darkmode: any;
        appLoading: boolean;
        config:Configuration;
    }
}