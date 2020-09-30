import * as dotenv from "dotenv";
import { app } from "electron";
import { copyFileSync, readFileSync } from "fs";
import { join } from "path";
dotenv.config();
console.log(
    "printing environment variables //-----------------------------------------------------------------------//",
    process.env,
    "end  of  environment variables //-----------------------------------------------------------------------//"
);

let config: Configuration;
const isDevelopement: boolean = process.env.NODE_ENV ? (process.env.NODE_ENV.toLowerCase() !== 'production' && process.env.NODE_ENV.toLowerCase() === 'developement') : false;
if (isDevelopement) {
    config = JSON.parse((readFileSync(process.env.CONFIGURATION_FILE)).toString());
} else {
    let configPath = join(app.getPath("appData"), "./config.json");
    try {
        config = require(configPath);//JSON.parse((readFileSync(configPath)).toString());
    } catch (err) {
        copyFileSync('./app/default.config.json', configPath);
        config = require(configPath);//JSON.parse((readFileSync(configPath)).toString());
    }
}
config.isDevelopement = isDevelopement;
global.config = config;

console.log(global.config);

export default config;