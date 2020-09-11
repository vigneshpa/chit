import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
});
window.ipcrenderer.send("ping");
console.log("Sent ping to the renderer.");
window.ipcrenderer.on("pong", function(event){
  console.log("Got pong from the renderer");
});

export default store;