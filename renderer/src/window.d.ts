import { IpcRenderer } from "electron";
import Vuetify from "vuetify/lib";
import { Store } from "vuex";

declare global {
    interface Window {
        ipcrenderer: IpcRenderer;
        app: Vue;
        store: Store<State>;
        vuetify:typeof Vuetify;
        config:Configuration
    }
    interface State {
        appLoading: boolean;
    }
}