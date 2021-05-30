import { App, ComponentPublicInstance } from "vue";

declare global {
    interface Window {
        VueApp: App
        app: ComponentPublicInstance
    }
}