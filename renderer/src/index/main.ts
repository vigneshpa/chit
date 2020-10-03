import Vue from 'vue';
import vuetify from "@/plugins/vuetify";
import store from './store';
import App from './App.vue';

Vue.config.productionTip = false;

window.app = new Vue({
  store,
  render: h => h(App),
  vuetify
}).$mount('#app');