"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preWindow = window;
preWindow.ipcrenderer = require("electron").ipcRenderer;
preWindow.config = preWindow.ipcrenderer.sendSync("get-config");
console.log("Loaded 'ipcrenderer' and 'config' into the window");
