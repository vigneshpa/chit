alert("Browsers are not supported yet");
const events = {};
const ipcrenderer = {
    on(){},
    send(){},
    once(){}
};
const config:Configuration = {
    isDevelopement:false,
    theme:"system",
    databaseFile:{},
    configPath:"",
    updates:{
        autoCheck:true,
        autoDownload:false
    }
};
window.ipcrenderer = ipcrenderer;
window.config = config;
interface Window{
    ipcrenderer?:Ipcrenderer;
    config?:Configuration;
}
interface Ipcrenderer{

}