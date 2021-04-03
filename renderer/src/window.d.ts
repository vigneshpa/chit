import Vuetify from "vuetify/lib";
import "chitcore";

declare global {
    interface Window {
        ipcirenderer: IpciRenderer;
        app: Vue;
        vuetify:Vuetify;
        config:Configuration;
        openExternal:(url:string)=>Void;
        isOnline?:boolean;
        isPWA?:boolean;
        showMessageBox:(options:ChitMessageBoxOptions)=>void;
        showAlert:(alr:("cached"|"offline"))=>void;
    }
}