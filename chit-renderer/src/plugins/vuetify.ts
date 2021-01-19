import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');

let darktheme: boolean = darkModeMedia.matches;

let theme: Configuration["theme"] = (window.config?.theme) || "system";

if (theme !== "system") {
    darktheme = (theme === "dark");
} else {
    darkModeMedia.addEventListener("change", function (ev) {
        vuetify.framework.theme.dark = ev.matches;
        document.documentElement.setAttribute("data-theme", ev.matches?"dark":"light");
    });
}

Vue.use(Vuetify);
const vuetify = new Vuetify({
    theme: {
        dark: darktheme,
        disable: false
    },
    icons: {
        iconfont: "mdi"
    }
});
document.documentElement.setAttribute("data-theme", darktheme?"dark":"light");
window.vuetify = vuetify;

window.openExternal = function (url) {
    window.ipcirenderer.call("open-external", {url});
};

export default vuetify;