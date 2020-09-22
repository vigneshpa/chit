# Chit Management Syatem

## About this Software

   This software aims to automate most of the work doene by chit
   business holders. This software is available under free [GPL3](./LICENSE.md) license.

>This is a free software.   
Everyone is permited to use and distribute copies of this software

## Features
- Data integrity check
- Report generation
- Beautiful Google Material Design UI

## Involving in developement
This software is completely written in JavaScript ( with TypeScript ) using [Electron](https://electronjs.org/) and [Vue](https://vuejs.org) ( with [vuetify](https://vuetifyjs.com) ) frameworks.
[Electron Builder](https://www.electron.build) is used in this software to build the cross-platform executables. This DataBase Management system used in this software is [SQlite3](https://www.sqlite.org). To involve in developement clone this repository localy by the following command.

```
git clone https://github.com/vigneshpa/chit.git
cd chit
npm install
```

## Software structure
   This software has two sub parts or modules(npm).
1. Main
2. Renderer

The main module does everything except from UI like database management,  windows management and system dialouges.This module uses native SQlite3 module for database management.   
   
The renderer module holds the UI of the app. This is a [vue-cli](https://cli.vuejs.org/) tool's project. This module builds into the app directory of the main module for packing.   

These renderer module communicate to main module via ipcRenderer module which is loaded into every browser window. The ipcMain module in the main module recives these communications.

## Developement
This software uses webpack dev server for hot reloading during developement.The [.env](./main/.env) file contains required configuration for developement.

Starting developement server
```
cd renderer
npm run serve
```
Startind developement electron
```
cd main
electron .
```

## Building
To build this software the renderer and the main modules must be built seperately

To build renderer
```
cd renderer
npm run build
```
To build main
```
cd main
tsc
```