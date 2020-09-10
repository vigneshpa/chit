"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preWindow = window;
preWindow.ipcrenderer = require("electron").ipcRenderer;
console.log("Loaded 'ipcrenderer' into the window");
