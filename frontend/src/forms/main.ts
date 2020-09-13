import Vue from 'vue';
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";

Vue.config.productionTip = false;

window.app = new Vue({
  render: h => h(App),
  vuetify
}).$mount('#app');