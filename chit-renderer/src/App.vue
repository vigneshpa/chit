<template lang="pug">
v-app#1_app
  v-dialog(v-model="form.visible" max-width="500" scrollable)
    chit-form(v-if="form.visible" :type="form.type")
  v-navigation-drawer(v-model="drawer", app, clipped)
    v-list(dense)
      router-link(
          v-for="item, index in this.$router.options.routes",
          v-bind:key="index",
          :to="item.path",
          v-slot="{ href, navigate, isActive}"
          )
        v-list-item(
          :active="isActive",
          :href="href",
          @click="navigate;drawer = null"
        )
          v-list-item-action(v-if="item.meta.icon")
            v-icon {{ item.meta.icon }}
          v-list-item-content
            v-list-item-title {{ item.name }}

  v-app-bar(
    app,
    clipped-left,
    color="blue",
    dark,
    :loading="this.appLoading"
  )
    v-app-bar-nav-icon(@click.stop="drawer = !drawer")
    v-toolbar-title {{ pageTitle }}
    v-spacer
    v-menu(offset-y)
      template(v-slot:activator="{ on, attrs }")
        v-btn(dark, icon, v-bind="attrs", v-on="on")
          v-icon mdi-plus

      v-list
        v-list-item(
          v-for="item in addList",
          v-bind:key="item.key",
          @click="openForm(item.form)"
        )
          v-list-item-action(v-if="item.icon")
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title {{ item.title }}

  v-main
    transition(name="fade")
      router-view

  v-footer(app, dense)
    span {{ config.databaseFile.location }}
    v-spacer
    span
      a(@click="openGithub")
        v-icon(size="20") mdi-github
        | vigneshpa/chit
      a(@click="openGithubLicense")  &copy; {{ new Date().getFullYear() }} GPL3
</template>

<script lang="ts">
import Vue from "vue";
type FormType = "addUser" | "addGroup";
export default Vue.extend({
  props: {
    source: String,
  },
  data: () => ({
    drawer: null as boolean | null,
    config: window.config as Configuration,
    addList: [
      {
        title: "Add User",
        key: 1,
        form: "addUser",
        icon: "mdi-account-plus",
      },
      {
        title: "Add Group",
        key: 2,
        form: "addGroup",
        icon: "mdi-account-multiple-plus",
      },
    ],
    appLoading: false,
    form: {
      type: "" as FormType,
      visible: false,
    },
  }),
  computed: {
    pageTitle() {
      if(this.$route?.name)return this.$route.name;
      return "Chit Management System";
    },
  },
  watch: {
    pageTitle(){
      window.document.title = this.pageTitle;
    }
  },
  methods: {
    openGithub(ev: Event) {
      ev.preventDefault();
      window.openExternal("https://github.com/vigneshpa/chit");
    },
    openGithubLicense(ev: Event) {
      ev.preventDefault();
      window.openExternal(
        "https://github.com/vigneshpa/chit/blob/master/LICENSE.md"
      );
    },
    openForm(form: FormType) {
      this.form.type = form;
      this.form.visible = true;
    },
  },
  components: {
    "chit-form":()=> import("@/components/chit-form.vue"),
  },
});
window.ipcrenderer.on("pong", function(event) {
  console.log("Got pong from the renderer");
});
window.ipcrenderer.send("ping");
console.log("Sent ping to the renderer.");
</script>
<style>
html {
  overflow: auto;
}
</style>
