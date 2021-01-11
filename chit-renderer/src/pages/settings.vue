<template lang="pug">
v-container#settings(fluid)
  v-card
    v-card-title Settings
    v-divider
    v-tabs(:vertical="$vuetify.breakpoint.mdAndUp")
      v-tab
        | Theme
        v-icon(right) mdi-palette
      v-tab
        | Data
        v-icon(right) mdi-database-lock
      v-tab
        | Updates
        v-icon(right) mdi-update
      v-tab-item
        v-card(flat)
          v-card-title
            v-icon(left) mdi-palette
            | Color Scheme
          v-card-text
            v-switch(v-model="darkModeFollowSystem", label="Follow system")
            v-expand-transition
              v-radio-group(
                v-model="customColorScheme",
                :disabled="darkModeFollowSystem",
                v-if="!darkModeFollowSystem",
                label="Choose color scheme"
              )
                v-radio(label="light", value="light")
                v-radio(label="dark", value="dark")
      v-tab-item
        v-card(flat)
          v-card-title
            v-icon(left) mdi-database-lock
            | Database file
          v-card-text
            v-switch(
              label="Use app's default location to store data",
              v-model="dbFileUseAppLocation"
            )
            v-expand-transition
              v-text-field(
                :disabled="dbFileUseAppLocation",
                readonly,
                label="Database file Location",
                v-model="dbFileLocation",
                @click="chooseDBfile"
              )
      v-tab-item
        v-card(flat)
          v-card-title
            v-icon(left) mdi-update
            | Updates
          v-card-text
            v-switch(
              label="Check for updates Automaticaly",
              v-model="updateAutomaticCheck"
            )
            v-switch(
              label="Download updates Automaticaly",
              v-model="updateAutomaticDownload"
            )
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: function() {
    return {
      darkModeFollowSystem: (this.config.theme === "system") as boolean,
      customColorScheme:
        this.config.theme === "system"
          ? null
          : (this.config.theme as "dark" | "light" | null),
      dbFileUseAppLocation: !this.config.databaseFile.isCustom,
      dbFileLocation: this.config.databaseFile.location,
      updateAutomaticCheck: this.config.updates.autoCheck,
      updateAutomaticDownload: this.config.updates.autoDownload,
    };
  },
  watch: {
    darkModeFollowSystem() {
      if (this.darkModeFollowSystem) {
        this.customColorScheme = null;
      } else if (!this.customColorScheme)
        this.customColorScheme = window.vuetify.framework.theme.dark
          ? "dark"
          : "light";
    },
    async customColorScheme() {
      if (this.customColorScheme) {
        this.config.theme = this.customColorScheme;
      } else {
        this.config.theme = "system";
      }
      await this.updateConfig();
      let isDark: boolean =
        this.config.theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
          : this.config.theme === "dark";
      window.vuetify.framework.theme.dark = isDark;
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
    },
    dbFileUseAppLocation() {
      this.config.databaseFile.isCustom = !this.dbFileUseAppLocation;
      this.updateConfig();
    },
    dbFileLocation() {
      this.config.databaseFile.location = this.dbFileLocation;
      this.updateConfig();
    },
    updateAutomaticCheck() {
      this.config.updates.autoCheck = this.updateAutomaticCheck;
      this.updateConfig();
    },
    updateAutomaticDownload() {
      this.config.updates.autoDownload = this.updateAutomaticDownload;
      this.updateConfig();
    },
  },
  methods: {
    updateConfig() {
      return new Promise(
        (
          resolve: (value: boolean) => void,
          reject: (reason: boolean) => void
        ) => {
          window.ipcrenderer.once("update-config", function(
            ev,
            response: boolean
          ) {
            if (response) {
              resolve(true);
            } else {
              reject(false);
            }
          });
          window.ipcrenderer.send("update-config", this.config);
        }
      );
    },
    async chooseDBfile(ev: Event) {
      this.config.databaseFile.isCustom = true;
      let options: ChitOpenDialogOptions = {
        properties: ["promptToCreate", "openFile"],
        title: "Choose a database file",
        message:
          "Choose a database file. If the file doesn't esists it will be created",
        defaultPath: this.config.databaseFile.location,
        filters: [{ name: "SQLite Database", extensions: ["db"] }],
      };
      let ret = await new Promise(
        (
          resolve: (value: ChitOpenDialogReturnValue) => void,
          reject: (reason: Error) => void
        ) => {
          window.ipcrenderer.once("show-open-dialog", (event, value) => {
            resolve(value);
          });
          window.ipcrenderer.send("show-open-dialog", options);
        }
      );
      if (!ret.canceled) {
        this.dbFileLocation = ret.filePaths.join("");
      }
    },
  },
  props: ["config"],
});
</script>
