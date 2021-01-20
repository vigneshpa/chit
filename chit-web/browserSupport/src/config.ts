import "chitCore";
let config: Configuration = {
  isDevelopement: false,
  theme: "system",
  databaseFile: {},
  configPath: "",
  updates: {
    autoCheck: true,
    autoDownload: false
  },
  vueApp: null
};
let ls = localStorage.getItem('config');
if (ls) {
  config = JSON.parse(ls);
} else {
  localStorage.setItem("config", JSON.stringify(config));
}
export function updateConfig(newConfig: Configuration) {
  try {
    localStorage.setItem("config", JSON.stringify(newConfig));
    return true;
  } catch (e) {
    return false;
  }
}
export default config;