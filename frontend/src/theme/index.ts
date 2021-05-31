import { App, defineAsyncComponent, DefineComponent, ref } from "vue"
const optionsDefault = {};
const storeDefault = {
    mobile: true as boolean,
    drawer: false as boolean,
    options: optionsDefault,
    confirm:false as boolean,
};
declare global {
    type TOptions = typeof optionsDefault;
    type TStore = typeof storeDefault;
}
export default class TTheme {
    store: TStore;
    constructor(options: TOptions = optionsDefault) {
        this.store = ref(storeDefault).value;
        this.store.options = ref(options).value;
    }
    install(app: App, options: TOptions) {
        this.store.options = options;
        app.config.globalProperties.$TTheme = this;
        const components = {
            "t-app": () => import("./TApp.vue"),
            "t-container": () => import("./TContainer.vue"),
            "t-icon-text": () => import("./TIconText.vue"),
            "t-confirm": () => import("./TConfirm.vue"),
            "t-drawer": () => import("./TDrawer.vue"),
            "t-nav": () => import("./TNav.vue"),
        } as { [key: string]: () => Promise<typeof import("*.vue")> };


        for (const name in components) {
            if (Object.prototype.hasOwnProperty.call(components, name)) {
                const func = components[name]; func()
                app.component(name, defineAsyncComponent(func));
            }
        }
    }
}