import { IpcRenderer } from "electron";
import { Store } from "vuex";

declare global {
    interface Window {
        ipcrenderer: IpcRenderer;
        app: Vue;
        store: Store<State>;
    }
    interface State {
        appLoading: boolean;
    }
}
