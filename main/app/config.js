"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
dotenv.config();
console.log("printing environment variables //-----------------------------------------------------------------------//", process.env, "end  of  environment variables //-----------------------------------------------------------------------//");
let config;
const isDevelopement = process.env.NODE_ENV ? (process.env.NODE_ENV.toLowerCase() !== 'production' && process.env.NODE_ENV.toLowerCase() === 'developement') : false;
if (isDevelopement) {
    config = JSON.parse((fs_1.readFileSync(process.env.CONFIGURATION_FILE)).toString());
}
else {
    let configPath = path_1.join(electron_1.app.getPath("appData"), "./config.json");
    try {
        config = JSON.parse((fs_1.readFileSync(configPath)).toString());
    }
    catch (err) {
        fs_1.copyFileSync('./app/default.config.json', configPath);
        config = JSON.parse((fs_1.readFileSync(configPath)).toString());
    }
}
config.isDevelopement = isDevelopement;
global.config = config;
console.log(global.config);
exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUNqQyx1Q0FBK0I7QUFDL0IsMkJBQWdEO0FBQ2hELCtCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FDUCw0R0FBNEcsRUFDNUcsT0FBTyxDQUFDLEdBQUcsRUFDWCw0R0FBNEcsQ0FDL0csQ0FBQztBQUVGLElBQUksTUFBcUIsQ0FBQztBQUMxQixNQUFNLGNBQWMsR0FBWSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxZQUFZLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM5SyxJQUFJLGNBQWMsRUFBRTtJQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztDQUNsRjtLQUFNO0lBQ0gsSUFBSSxVQUFVLEdBQUcsV0FBSSxDQUFDLGNBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDL0QsSUFBSTtRQUNBLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsaUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDOUQ7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLGlCQUFZLENBQUMsMkJBQTJCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEQsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxpQkFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUM5RDtDQUNKO0FBQ0QsTUFBTSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7QUFDdkMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFFdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFM0Isa0JBQWUsTUFBTSxDQUFDIn0=