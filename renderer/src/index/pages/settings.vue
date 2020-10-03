<template>
  <v-container fluid id="settings">
    <v-card>
    <v-card-title>Dark mode</v-card-title>
    <v-card-text>
    <v-switch v-model="darkModeFollowSystem" label="Follow system"></v-switch>
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
  </v-container>
</template>
<script lang="ts">
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
      if(this.customColorScheme)window.store.commit("changeColorScheme", this.customColorScheme);
    },
  },
  methods: {},
});
</script>