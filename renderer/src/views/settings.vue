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
  },
  methods: {
    async updateConfig() {
      return window.ipcirenderer.callMethod("updateConfig", this.config);
    },
  },
  props: ["config"],
});
</script>
