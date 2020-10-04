<template>
  <v-app id="1_app">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item
          v-for="item in drawerList"
          v-bind:key="item.key"
          @click="
            page = item.name;
            drawer = null;
          "
          active-class="drawerActive"
          :class="{ drawerActive: page === item.name }"
        >
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="blue"
      dark
      v-bind:loading="this.$store.state.appLoading"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="item in addList"
            v-bind:key="item.key"
            @click="item.onClick"
          >
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <dashboard v-if="this.page === 'dashboard'" />
      <settings v-else-if="this.page === 'settings'" />
      <users v-else-if="this.page === 'users'" />
    </v-main>

    <v-footer app dense>
      <span>
        {{ $store.state.config.databaseFile.location }}
      </span>
      <v-spacer></v-spacer>
      <span>
        <a @click="openGithub">
          <v-icon size="20">mdi-github</v-icon>vigneshpa/chit
        </a>
        &copy; {{ new Date().getFullYear() }} GPL3
      </span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import dashboard from "./pages/dashboard.vue";
import settings from "./pages/settings.vue";
import users from "./pages/users.vue";

export default Vue.extend({
  props: {
    source: String,
  },
  data: () => ({
    drawer: null as boolean | null,
    page: "dashboard" as "dashboard" | "settings",
    addList: [
      {
        title: "Add User",
        key: 1,
        onClick: () => {
          window.store.commit("openForm", "addUser");
        },
        icon: "mdi-account-plus",
      },
      {
        title: "Add Group",
        key: 2,
        onClick: () => {
          window.store.commit("openForm", "addGroup");
        },
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
        title: "Settings",
        name: "settings",
        key: 2,
        icon: "mdi-cog",
      },
    ],
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
  methods: {
    openGithub(ev: Event) {
      ev.preventDefault();
      window.openExternal("https://github.com/vigneshpa/chit");
    },
  },
  created() {},
  components: {
    dashboard,
    settings,
    users,
  },
});
</script>
<style>
html {
  overflow: auto;
}
</style>