import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');

let darktheme: boolean = darkModeMedia.matches;

let theme: Theme = window.config.theme;

if (theme !== "system") {
    darktheme = (theme === "dark");
} else {
    darkModeMedia.addEventListener("change", function (ev) {
        vuetify.framework.theme.dark = ev.matches;
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
window.vuetify = vuetify;

window.openExternal = function (url) {
    window.ipcrenderer.send("open-external", url);
};

export default vuetify;