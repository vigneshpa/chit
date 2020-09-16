import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

let darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');

Vue.use(Vuetify);
const vuetify = new Vuetify({
    theme:{
        dark:darkModeMedia.matches,
        disable:false
    },
    icons:{
        iconfont:"mdi"
    }
});
window.vuetify = vuetify;

darkModeMedia.addEventListener("change", function(ev){
    vuetify.framework.theme.dark = ev.matches;
});

window.openExternal = function(url){
    window.ipcrenderer.send("open-external", url);
};

export default vuetify;