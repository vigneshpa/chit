<template lang="pug">
v-container(fluid)#settings
 v-row
  v-col(cols="12" xs="12" sm="12" md="6" lg="4")
    v-card
      v-card-title
        v-icon(left) mdi-palette
        | Color Scheme
      v-divider
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
  v-col(cols="12" xs="12" sm="12" md="6" lg="4")
    v-card
      v-card-title
        v-icon(left) mdi-database-lock
        | Database file
      v-divider
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
  v-col(cols="12" xs="12" sm="12" md="6" lg="4")
    v-card
      v-card-title
        v-icon(left) mdi-update
        | Updates
      v-divider
      v-card-text
        v-switch(
          label="Check for updates Automaticaly",
          v-model="updateAutomaticCheck"
        )
        v-switch(
          label="Download updates Automaticaly",
          v-model="updateAutomaticDownload"
        )
  v-col(cols="12" xs="12" sm="12" md="6" lg="4")
    v-card
      v-card-title
        | Other Settings
      v-divider
      v-card-text
        v-text-field(
          lable = "Time Locale"
          v-model="locale"
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
      locale: this.config.locale,
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
    async updateConfig() {
      return window.ipcirenderer.callMethod("updateConfig", this.config);
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
      const ret = await window.ipcirenderer.callMethod(
        "showOpenDialog",
        options
      );
      if (!ret.canceled) {
        this.dbFileLocation = ret.filePaths.join("");
      }
    },
  },
  props: ["config"],
});
</script>
