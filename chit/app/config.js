"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
dotenv.config({
    path: path_1.join(__dirname, "./.env")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUNqQyx1Q0FBK0I7QUFDL0IsMkJBQWlEO0FBQ2pELCtCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ1YsSUFBSSxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO0NBQ2xDLENBQUMsQ0FBQztBQUNILGVBQWU7QUFDZiwrR0FBK0c7QUFDL0csbUJBQW1CO0FBQ25CLDhHQUE4RztBQUM5RyxLQUFLO0FBQ0wsZ0JBQWdCO0FBQ2hCLE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFDWixZQUFZLEVBQUMsSUFBSTtJQUNqQixjQUFjLEVBQUMsSUFBSTtJQUNuQixnQkFBZ0IsRUFBQyxLQUFLO0lBQ3RCLE9BQU8sRUFBQyxRQUFRO0lBQ2hCLFNBQVMsRUFBQztRQUNOLFdBQVcsRUFBQyxJQUFJO1FBQ2hCLGNBQWMsRUFBQyxLQUFLO0tBQ3ZCO0lBQ0QsUUFBUSxFQUFDLFlBQVk7Q0FDeEIsQ0FBQztBQUdGLElBQUksVUFBa0IsQ0FBQztBQUN2QixNQUFNLGNBQWMsR0FBWSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxZQUFZLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM5SyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ3RFLElBQUksY0FBYyxFQUFFO0lBQ2hCLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0NBQy9DO0tBQU07SUFDSCxVQUFVLEdBQUcsV0FBSSxDQUFDLGNBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7Q0FDL0Q7QUFFRCxJQUFJO0lBQ0EsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsaUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Q0FDckU7QUFBQyxPQUFPLEdBQUcsRUFBRTtJQUNWLHNFQUFzRTtJQUN0RSxrQkFBYSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0NBQ3JFO0FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0FBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUUzQixrQkFBZSxNQUFNLENBQUMsTUFBTSxDQUFDIn0=