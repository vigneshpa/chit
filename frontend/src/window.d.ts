import { IpcRenderer } from "electron";
import { Store } from "vuex";

declare global {
    interface Window {
        ipcrenderer: IpcRenderer;
        app: Vue;
        store: Store<State>;
        addUserData: {
            name: string;
            phone: string;
            address: string;
            step:number;
        }
    }
    interface State {
        appLoading: boolean;
    }
}