import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

window.VueApp = createApp(App).use(store).use(router);
window.app = window.VueApp.mount('#app');