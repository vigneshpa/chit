import * as dotenv from "dotenv";
import { app } from "electron";
import { copyFileSync, readFileSync } from "fs";
import { join } from "path";
dotenv.config({
    path:join(__dirname, "./.env")
});
console.log(
    "//----------------------- printing environment variables ------------------------------------------//",
    process.env,
    "//----------------------- end  of  environment variables ------------------------------------------//"
);

let config: Configuration;
let configPath: string;
const isDevelopement: boolean = process.env.NODE_ENV ? (process.env.NODE_ENV.toLowerCase() !== 'production' && process.env.NODE_ENV.toLowerCase() === 'developement') : false;
process.env.NODE_ENV = isDevelopement?"developement":"production";
if (isDevelopement) {
    configPath = process.env.CONFIGURATION_FILE;
} else {
    configPath = join(app.getPath("appData"), "./config.json");
}
try {
    config = JSON.parse((readFileSync(configPath)).toString());
} catch (err) {
    copyFileSync(join(__dirname, './default.config.json'), configPath);
    config = JSON.parse((readFileSync(configPath)).toString());
}
config.isDevelopement = isDevelopement;
config.configPath = configPath;
global.config = config;

console.log(global.config);

export default config;