import Vue from 'vue';
import vuetify from "@/plugins/vuetify";
import App from './App.vue';
Vue.config.productionTip = false;


window.app = new Vue({
  render: h => h(App),
  vuetify,
}).$mount('#app');