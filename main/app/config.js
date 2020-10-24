"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
dotenv.config();
console.log("printing environment variables //-----------------------------------------------------------------------//", process.env, "end  of  environment variables //-----------------------------------------------------------------------//");
let config;
let configPath;
const isDevelopement = process.env.NODE_ENV ? (process.env.NODE_ENV.toLowerCase() !== 'production' && process.env.NODE_ENV.toLowerCase() === 'developement') : false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUNqQyx1Q0FBK0I7QUFDL0IsMkJBQWdEO0FBQ2hELCtCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FDUCw0R0FBNEcsRUFDNUcsT0FBTyxDQUFDLEdBQUcsRUFDWCw0R0FBNEcsQ0FDL0csQ0FBQztBQUVGLElBQUksTUFBcUIsQ0FBQztBQUMxQixJQUFJLFVBQWtCLENBQUM7QUFDdkIsTUFBTSxjQUFjLEdBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssWUFBWSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDOUssSUFBSSxjQUFjLEVBQUU7SUFDaEIsVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7Q0FDL0M7S0FBTTtJQUNILFVBQVUsR0FBRyxXQUFJLENBQUMsY0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztDQUM5RDtBQUNELElBQUk7SUFDQSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0NBQzlEO0FBQUMsT0FBTyxHQUFHLEVBQUU7SUFDVixpQkFBWSxDQUFDLFdBQUksQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNuRSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0NBQzlEO0FBQ0QsTUFBTSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7QUFDdkMsTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDL0IsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFFdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFM0Isa0JBQWUsTUFBTSxDQUFDIn0=