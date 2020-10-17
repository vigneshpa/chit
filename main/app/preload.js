"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preWindow = window;
preWindow.ipcrenderer = require("electron").ipcRenderer;
preWindow.config = preWindow.ipcrenderer.sendSync("get-config");
console.log("Loaded 'ipcrenderer' and 'config' into the window");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmVsb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsTUFBTSxTQUFTLEdBQWMsTUFBTSxDQUFDO0FBQ3BDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUN4RCxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRWhFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELENBQUMsQ0FBQyJ9