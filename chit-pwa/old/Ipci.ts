const mainHandlers = {} as IpciMain["handlers"];
const rendererHandlers = {} as IpciRenderer["handlers"];
var main:IpciMain = {
    handlers:mainHandlers,
    init(handlers){
        main.handlers = handlers;
    }
};
var webContents:IpciWebcontents = {
    async callMethod(method, ...args){
        return await renderer.handlers[method](renderer, ...args);
    }
};
var renderer:IpciRenderer = {
    handlers:rendererHandlers,
    init(handlers){
        renderer.handlers = handlers;
    },
    async callMethod(method, ...args){
        return await main.handlers[method](webContents, ...args);
    }
}
export {main as ipciMain, renderer as ipciRenderer}