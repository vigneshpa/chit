"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
dotenv.config();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUNqQyx1Q0FBK0I7QUFDL0IsMkJBQWdEO0FBQ2hELCtCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FDUCx1R0FBdUcsRUFDdkcsT0FBTyxDQUFDLEdBQUcsRUFDWCx1R0FBdUcsQ0FDMUcsQ0FBQztBQUVGLElBQUksTUFBcUIsQ0FBQztBQUMxQixJQUFJLFVBQWtCLENBQUM7QUFDdkIsTUFBTSxjQUFjLEdBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssWUFBWSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDOUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFBLENBQUMsQ0FBQSxjQUFjLENBQUEsQ0FBQyxDQUFBLFlBQVksQ0FBQztBQUNsRSxJQUFJLGNBQWMsRUFBRTtJQUNoQixVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztDQUMvQztLQUFNO0lBQ0gsVUFBVSxHQUFHLFdBQUksQ0FBQyxjQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0NBQzlEO0FBQ0QsSUFBSTtJQUNBLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsaUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Q0FDOUQ7QUFBQyxPQUFPLEdBQUcsRUFBRTtJQUNWLGlCQUFZLENBQUMsV0FBSSxDQUFDLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsaUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Q0FDOUQ7QUFDRCxNQUFNLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztBQUN2QyxNQUFNLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUMvQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUV2QixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUUzQixrQkFBZSxNQUFNLENBQUMifQ==