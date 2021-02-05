# Chit Management System

## About this Software

   This software aims to automate most of the work done by chit funding
   business holders. This software is available under free [GPL3](./LICENSE.md) license.

>This is a free software.   
Everyone is permited to use and distribute copies of this software

## Features
- Data integrity check
- Report generation
- Beautiful Google Material Design UI

## Involving in developement
>This is just information to developers who want to modify this software for their needs.
Suggestions and bug reports are welcomed but you can't contribute to this project.
If you want to do so just fork it and you must follow the GPL-3.0 conditions.

This software is completely written in TypeScripit ( with some vanilla JS) using [Vue](https://vuejs.org) ( with [vuetify](https://vuetifyjs.com) ), [Electron](https://electronjs.org/) and [Express](https://expressjs.com/) frameworks for the desktop app and web app.

[Electron Builder](https://www.electron.build) is used in this software to build the cross-platform executables. [TypeORM](https://typeorm.io/) Object Relation Modeller is used to model and store data.

To involve in developement clone this repository localy by the following command.

```
git clone https://github.com/vigneshpa/chit.git
cd chit
```

## Software structure
   This software has four sub parts or modules(npm).
1. Core
2. Renderer
3. Electron
4. Web

The Core is a platform agonostic common library which has common TypeDefinitions and DataBase ORM interfaces

The Render module is [Vue CLI](https://cli.vuejs.org/)'s project holding the UI of the app  

The Electron module imports the UI from the Renderer and implements platform functions for electron

## Developement
The Vue CLI's dev server doesnot work here because before loading the UI IPCi Renderer must be loaded into the renderer process or browser.

If you use VSCode for developement just allow automatic folder tasks to start the TypeScript watcher(s) and Vue CLI watcher automaticaly

### Starting developement server for Web
```
cd web
npm run dev
```
### Electron developement

For electron you must start the watcher manually
and start the electron app.
the developement configurations will be used while the wather is running.
```
cd chit
npm run dev
```
```
npx electron .
```

## Building

>WARNING:  
Disable syncronise in connection options to prevent any dataloss in production updates.

### Building the Express App
To build the express app just cd into the web directory and run
```
npm run build
```
This will generate a Express package in the dist directory which you can deploy on your nodeJS server.

### Building the Electron App

To compile the project just cd to chit-electron and run
```
npm run build
```
This command will build the Vue UI and prepares the app for bundeling.
Ofcourse you can check your app before bundeling the installer executables
just run
```
npm run dist
```
It will create a unpacked app (for your host system) in the dist directory for us to check before creating installers

Finally to build the installers run
```
npm run bundle
```