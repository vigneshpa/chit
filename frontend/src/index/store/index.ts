import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appLoading:false
  } as State,
  mutations: {
    openForm(state, form:string){
      state.appLoading = true;
      window.ipcrenderer.send("open-forms", form);
    }
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
window.store = store
export default store;