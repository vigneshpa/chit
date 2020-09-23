function getConfig(){
    window.config = window.ipcrenderer.sendSync("get-config");
};
function run(){
    getConfig();
};
export default run;