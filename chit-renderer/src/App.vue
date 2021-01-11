<template lang="pug">
v-app#1_app
  v-dialog(v-model="form.visible")
    chit-form(:type="form.type")
  v-navigation-drawer(v-model="drawer", app, clipped)
    v-list(dense)
      v-list-item(
        v-for="item in drawerList",
        v-bind:key="item.key",
        @click="page = item.name; drawer = null",
        active-class="drawerActive",
        :class="{ drawerActive: page === item.name }"
      )
        v-list-item-action(v-if="item.icon")
          v-icon {{ item.icon }}
        v-list-item-content
          v-list-item-title {{ item.title }}

  v-app-bar(
    app,
    clipped-left,
    color="blue",
    dark,
    v-bind:loading="this.appLoading"
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
    dashboard(v-if="this.page === 'dashboard'")
    settings(v-else-if="this.page === 'settings'" :config = "config")
    users(v-else-if="this.page === 'users'")
    groups(v-else-if="this.page === 'groups'")

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
import dashboard from "./pages/dashboard.vue";
import settings from "./pages/settings.vue";
import users from "./pages/users.vue";
import groups from "./pages/groups.vue";
import chitForm from "@/components/chit-form.vue";
type FormType = "addUser"|"addGroup";
export default Vue.extend({
  props: {
    source: String,
  },
  data: () => ({
    drawer: null as boolean | null,
    page: "dashboard" as string,
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
    drawerList: [
      {
        title: "Dashboard",
        name: "dashboard",
        key: 1,
        icon: "mdi-view-dashboard",
      },
      {
        title: "Users",
        name: "users",
        key: 3,
        icon: "mdi-account-multiple",
      },
      {
        title: "Groups",
        name: "groups",
        key: 4,
        icon: "mdi-account-group",
      },
      {
        title: "Settings",
        name: "settings",
        key: 2,
        icon: "mdi-cog",
      },
    ],
    appLoading: false,
    form:{
      type:"" as FormType,
      visible:false,
    }
  }),
  computed: {
    pageTitle(): string {
      for (const element of this.drawerList) {
        if (element.name === this.page) {
          return element.title;
        }
      }
      return "Chit Management System";
    },
  },
  watch: {
    page() {
      window.document.title = this.pageTitle
    },
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
    dashboard,
    settings,
    users,
    groups,
    "chit-form":chitForm,
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
