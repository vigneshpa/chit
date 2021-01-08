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
    // copyFileSync(join(__dirname, './default.config.json'), configPath);
    fs_1.writeFileSync(configPath, JSON.stringify(global.config));
    global.config = JSON.parse((fs_1.readFileSync(configPath)).toString());
}
global.config.isDevelopement = isDevelopement;
global.config.configPath = configPath;
console.log(global.config);
exports.default = global.config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUNqQyx1Q0FBK0I7QUFDL0IsMkJBQWlEO0FBQ2pELCtCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ1YsSUFBSSxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO0NBQ2xDLENBQUMsQ0FBQztBQUNILE9BQU8sQ0FBQyxHQUFHLENBQ1AsdUdBQXVHLEVBQ3ZHLE9BQU8sQ0FBQyxHQUFHLEVBQ1gsdUdBQXVHLENBQzFHLENBQUM7QUFDRixnQkFBZ0I7QUFDaEIsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUNaLFlBQVksRUFBQyxJQUFJO0lBQ2pCLGNBQWMsRUFBQyxJQUFJO0lBQ25CLGdCQUFnQixFQUFDLEtBQUs7SUFDdEIsT0FBTyxFQUFDLFFBQVE7SUFDaEIsU0FBUyxFQUFDO1FBQ04sV0FBVyxFQUFDLElBQUk7UUFDaEIsY0FBYyxFQUFDLEtBQUs7S0FDdkI7SUFDRCxRQUFRLEVBQUMsWUFBWTtDQUN4QixDQUFDO0FBR0YsSUFBSSxVQUFrQixDQUFDO0FBQ3ZCLE1BQU0sY0FBYyxHQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLFlBQVksSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzlLLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDdEUsSUFBSSxjQUFjLEVBQUU7SUFDaEIsVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7Q0FDL0M7S0FBTTtJQUNILFVBQVUsR0FBRyxXQUFJLENBQUMsY0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztDQUMvRDtBQUVELElBQUk7SUFDQSxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxpQkFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztDQUNyRTtBQUFDLE9BQU8sR0FBRyxFQUFFO0lBQ1Ysc0VBQXNFO0lBQ3RFLGtCQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDekQsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsaUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Q0FDckU7QUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7QUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTNCLGtCQUFlLE1BQU0sQ0FBQyxNQUFNLENBQUMifQ==