import * as dotenv from "dotenv";
import { readFileSync } from "fs";
dotenv.config();
console.log(process.env);

let config:Configuration = JSON.parse(readFileSync(process.env.CONFIGURATION_FILE).toString());
config.isDevelopement = process.env.NODE_ENV?(process.env.NODE_ENV.toLowerCase() !== 'production' && process.env.NODE_ENV.toLowerCase() === 'developement') : config.isDevelopement;
global.config = config;

export default config;