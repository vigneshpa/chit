import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    appLoading: false,
    config: window.config,
    darkmode: window.config.theme as ("system" | "dark" | "light")
  } as State,
  mutations: {
    openForm(state, form: string) {
      state.appLoading = true;
      window.ipcrenderer.send("open-forms", form, {});
    },
    async changeColorScheme(state, scheme:("system" | "dark" | "light")){
      state.config.theme = scheme;
      await updateConfig();
      state.darkmode = scheme;
      let isDark : boolean = (scheme === "system")?window.matchMedia('(prefers-color-scheme: dark)').matches:(scheme === "dark");
      window.vuetify.framework.theme.dark = isDark;
      document.documentElement.setAttribute("data-theme", isDark?"dark":"light");
    },
    async updateConfig(state){
      await updateConfig();
    }
  },
  actions: {
  },
  modules: {
  },
});
function updateConfig(){
  return new Promise((resolve:(value:boolean)=>void, reject:(reason:boolean)=>void)=>{
    window.ipcrenderer.once("update-config", function(ev, response:boolean){
      if(response){
        resolve(true);
      }else{
        reject(false);
      }
    });
    window.ipcrenderer.send("update-config", window.store.state.config);
  });
}
window.ipcrenderer.on("pong", function (event) {
  console.log("Got pong from the renderer");
});
window.ipcrenderer.send("ping");
console.log("Sent ping to the renderer.");
window.store = store;
export default store;