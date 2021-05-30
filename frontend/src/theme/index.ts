import { App, defineAsyncComponent, ref } from "vue"
const optionsDefault = {};
const storeDefault = {
    mobile:true as boolean,
    drawer:false as boolean,
};
declare global {
    type TOptions = typeof optionsDefault;
    type TStore = typeof storeDefault;
}
export default class TTheme {
    options: TOptions;
    store : TStore;
    constructor(options: TOptions = optionsDefault) {
        this.options = ref(options).value;
        this.store = ref(storeDefault).value;
    }
    install(app: App, options: TOptions) {
        this.options = options;
        app.config.globalProperties.$TTheme = this;
        app.component("t-container", defineAsyncComponent(() => import("./TContainer.vue")));
        app.component("t-app", defineAsyncComponent(() => import("./TApp.vue")));
        app.component("t-drawer", defineAsyncComponent(() => import("./TDrawer.vue")));
        app.component("t-nav", defineAsyncComponent(() => import("./TNav.vue")));
    }
}