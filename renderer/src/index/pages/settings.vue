<template>
  <v-container fluid id="settings">
    <v-card>
      <v-card-title>Settings</v-card-title>
      <v-divider></v-divider>
      <v-tabs :vertical="$vuetify.breakpoint.mdAndUp">
        <v-tab><v-icon left>mdi-palette</v-icon> Theme </v-tab>
        <v-tab><v-icon left>mdi-database-lock</v-icon> Data </v-tab>
        <v-tab><v-icon left>mdi-cable-data</v-icon> Test </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-title>Dark mode</v-card-title>
            <v-card-text>
              <v-switch
                v-model="darkModeFollowSystem"
                label="Follow system"
              ></v-switch>
              <v-expand-transition>
                <v-radio-group
                  v-model="customColorScheme"
                  :disabled="darkModeFollowSystem"
                  v-if="!darkModeFollowSystem"
                  label="Choose color scheme"
                >
                  <v-radio label="light" value="light"></v-radio>
                  <v-radio label="dark" value="dark"></v-radio>
                </v-radio-group>
              </v-expand-transition>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-title>Database file</v-card-title>
            <v-card-text>
              <v-switch
                label="Use app's default location to store data"
                v-model="dbFileUseAppLocation"
              ></v-switch>
              <v-expand-transition>
                <v-text-field
                  :disabled="dbFileUseAppLocation"
                  readonly
                  label="Database file Location"
                  v-model="dbFileLocation"
                  @click="chooseDBfile"
                ></v-text-field>
              </v-expand-transition>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import { config } from "process";
import Vue from "vue";
export default Vue.extend({
  data: function () {
    return {
      darkModeFollowSystem: (window.store.state.darkmode ===
        "system") as boolean,
      customColorScheme:
        window.store.state.darkmode === "system"
          ? null
          : (window.store.state.darkmode as "dark" | "light" | null),
      dbFileUseAppLocation: !window.config.databaseFile.isCustom,
      dbFileLocation:window.config.databaseFile.location
    };
  },
  watch: {
    darkModeFollowSystem() {
      if (this.darkModeFollowSystem) {
        this.customColorScheme = null;
        window.store.commit("changeColorScheme", "system");
      } else if (!this.customColorScheme)
        this.customColorScheme = window.vuetify.framework.theme.dark
          ? "dark"
          : "light";
    },
    customColorScheme() {
      if (this.customColorScheme)
        window.store.commit("changeColorScheme", this.customColorScheme);
    },
    dbFileUseAppLocation(){
      window.store.state.config.databaseFile.isCustom = !this.dbFileUseAppLocation;
      window.store.commit("updateConfig");
    },
    dbFileLocation(){
      window.store.state.config.databaseFile.location = this.dbFileLocation;
      window.store.commit("updateConfig");
    }
  },
  methods: {
    async chooseDBfile(ev:Event){
      window.store.state.config.databaseFile.isCustom = true;
      let options:OpenDialogOptions = {
        properties:["promptToCreate", "openFile"],
        title:"Choose a database file",
        message:"Choose a database file. If the file doesn't esists it will be created",
        defaultPath:window.store.state.config.databaseFile.location,
        filters:[{name:"SQLite Database", extensions:["db"]}]
      };
      let ret = await new Promise((resolve:(value:OpenDialogReturnValue)=>void, reject:(reason:Error)=>void)=>{
        window.ipcrenderer.once("show-dialog", (event, value:OpenDialogReturnValue)=>{
          resolve(value);
        })
        window.ipcrenderer.send("show-dialog", "open", options);
      });
      if(!ret.canceled){
        this.dbFileLocation = ret.filePaths.join("");
      }
    },
  },
});
</script>