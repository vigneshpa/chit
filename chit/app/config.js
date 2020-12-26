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
let config;
let configPath;
const isDevelopement = process.env.NODE_ENV ? (process.env.NODE_ENV.toLowerCase() !== 'production' && process.env.NODE_ENV.toLowerCase() === 'developement') : false;
process.env.NODE_ENV = isDevelopement ? "developement" : "production";
if (isDevelopement) {
    configPath = process.env.CONFIGURATION_FILE;
}
else {
    configPath = path_1.join(electron_1.app.getPath("appData"), "./config.json");
}
try {
    config = JSON.parse((fs_1.readFileSync(configPath)).toString());
}
catch (err) {
    fs_1.copyFileSync(path_1.join(__dirname, './default.config.json'), configPath);
    config = JSON.parse((fs_1.readFileSync(configPath)).toString());
}
config.isDevelopement = isDevelopement;
config.configPath = configPath;
global.config = config;
console.log(global.config);
exports.default = config;
