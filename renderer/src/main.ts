import Vue from 'vue';
import vuetify from "@/plugins/vuetify";
import App from './App.vue';
import router from './router';

if(window?.isPWA && !window?.isOnline)import("./registerServiceWorker");

Vue.config.productionTip = false;

window.app = new Vue({
  render: h => h(App),
  router,
  vuetify
}).$mount('#app');