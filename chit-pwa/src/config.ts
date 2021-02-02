let config: Configuration = {
  isDevelopement: false,
  theme: "system",
  databaseFile: {},
  configPath: "",
  updates: {
    autoCheck: true,
    autoDownload: false
  },
  vueApp: null,
  locale:"en-in"
};
let ls = localStorage.getItem('config');
if (ls) {
  config = JSON.parse(ls);
} else {
  localStorage.setItem("config", JSON.stringify(config));
}
export function updateConfig(newConfig: Configuration) {
    localStorage.setItem("config", JSON.stringify(newConfig));
    return;
}
export default config;