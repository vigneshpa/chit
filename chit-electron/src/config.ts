import * as dotenv from "dotenv";
import { app } from "electron";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
dotenv.config({
    path: join(__dirname, "./.env")
});
// console.log(
//     "//----------------------- printing environment variables ------------------------------------------//",
//     process.env,
//     "//----------------------- end  of  environment variables ------------------------------------------//"
// );
//Default config
global.config = {
    "configPath": null,
    "databaseFile": null,
    "isDevelopement": false,
    "theme": "system",
    "updates": {
        "autoCheck": true,
        "autoDownload": false
    },
    "vueApp": "chit-electron/renderer"
};


let configPath: string;
const isDevelopement: boolean = process.env.NODE_ENV ? (process.env.NODE_ENV.toLowerCase() !== 'production' && process.env.NODE_ENV.toLowerCase() === 'developement') : false;
process.env.NODE_ENV = isDevelopement ? "developement" : "production";
if (isDevelopement) {
    configPath = process.env.CONFIGURATION_FILE;
} else {
    configPath = join(app.getPath("userData"), "./config.json");
}

try {
    global.config = JSON.parse((readFileSync(configPath)).toString());
} catch (err) {
    // copyFileSync(join(__dirname, './default.config.json'), configPath);
    writeFileSync(configPath, JSON.stringify(global.config));
    global.config = JSON.parse((readFileSync(configPath)).toString());
}
global.config.isDevelopement = isDevelopement;
if (isDevelopement)
    global.config.vueApp = "./chit-renderer/app/renderer";
global.config.configPath = configPath;
console.log(global.config);

export default global.config;