import { IpcRenderer } from "electron";
import { Store } from "vuex";

declare global {
    interface Window {
        ipcrenderer: IpcRenderer;
        app: Vue;
        store: Store<State>;
        openExternal:(url:string)=>void
    }
    interface State {
        appLoading: boolean;
    }
}
