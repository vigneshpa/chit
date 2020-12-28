<template lang="pug">
v-container#settings(fluid)
  v-card
    v-card-title Settings
    v-divider
    v-tabs(:vertical="$vuetify.breakpoint.mdAndUp")
      v-tab
        v-icon(left) mdi-palette
        | Theme
      v-tab
        v-icon(left) mdi-database-lock
        | Data
      v-tab
        v-icon(left) mdi-update
        | Updates
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
  data: function () {
    return {
      darkModeFollowSystem: (window.store.state.darkmode ===
        "system") as boolean,
      customColorScheme:
        window.store.state.darkmode === "system"
          ? null
          : (window.store.state.darkmode as "dark" | "light" | null),
      dbFileUseAppLocation: !window.config.databaseFile.isCustom,
      dbFileLocation: window.config.databaseFile.location,
      updateAutomaticCheck: window.config.updates.autoCheck,
      updateAutomaticDownload: window.config.updates.autoDownload,
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
    dbFileUseAppLocation() {
      window.store.state.config.databaseFile.isCustom = !this
        .dbFileUseAppLocation;
      window.store.commit("updateConfig");
    },
    dbFileLocation() {
      window.store.state.config.databaseFile.location = this.dbFileLocation;
      window.store.commit("updateConfig");
    },
    updateAutomaticCheck() {
      window.store.state.config.updates.autoCheck = this.updateAutomaticCheck;
      window.store.commit("updateConfig");
    },
    updateAutomaticDownload() {
      window.store.state.config.updates.autoDownload = this.updateAutomaticDownload;
      window.store.commit("updateConfig");
    },
  },
  methods: {
    async chooseDBfile(ev: Event) {
      window.store.state.config.databaseFile.isCustom = true;
      let options: ChitOpenDialogOptions = {
        properties: ["promptToCreate", "openFile"],
        title: "Choose a database file",
        message:
          "Choose a database file. If the file doesn't esists it will be created",
        defaultPath: window.store.state.config.databaseFile.location,
        filters: [{ name: "SQLite Database", extensions: ["db"] }],
      };
      let ret = await new Promise(
        (
          resolve: (value: ChitOpenDialogReturnValue) => void,
          reject: (reason: Error) => void
        ) => {
          window.ipcrenderer.once(
            "show-dialog",
            (event, value: ChitOpenDialogReturnValue) => {
              resolve(value);
            }
          );
          window.ipcrenderer.send("show-dialog", "open", options);
        }
      );
      if (!ret.canceled) {
        this.dbFileLocation = ret.filePaths.join("");
      }
    },
  },
});
</script>