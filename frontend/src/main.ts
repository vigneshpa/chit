import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import TTheme from "./theme";

const theme = new TTheme();

window.VueApp = createApp(App).use(store).use(router).use(theme);
window.app = window.VueApp.mount('#app');