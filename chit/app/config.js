"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
dotenv.config({
    path: path_1.join(__dirname, "./.env")
});
console.log("//----------------------- printing environment variables ------------------------------------------//", process.env, "//----------------------- end  of  environment variables ------------------------------------------//");
global.config = {
    "configPath": null,
    "databaseFile": null,
    "isDevelopement": false,
    "theme": "system",
    "updates": {
        "autoCheck": true,
        "autoDownload": false
    },
    "vueApp": "./renderer"
};
let configPath;
const isDevelopement = process.env.NODE_ENV ? (process.env.NODE_ENV.toLowerCase() !== 'production' && process.env.NODE_ENV.toLowerCase() === 'developement') : false;
process.env.NODE_ENV = isDevelopement ? "developement" : "production";
if (isDevelopement) {
    configPath = process.env.CONFIGURATION_FILE;
}
else {
    configPath = path_1.join(electron_1.app.getPath("userData"), "./config.json");
}
try {
    global.config = JSON.parse((fs_1.readFileSync(configPath)).toString());
}
catch (err) {
    fs_1.writeFileSync(configPath, JSON.stringify(global.config));
    global.config = JSON.parse((fs_1.readFileSync(configPath)).toString());
}
global.config.isDevelopement = isDevelopement;
global.config.configPath = configPath;
console.log(global.config);
exports.default = global.config;
