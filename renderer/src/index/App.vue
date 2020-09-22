<template>
  <v-app id="1_app">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item v-for="item in drawerList" v-bind:key="item.key" @click="item.onClick">
          <v-list-item-action v-if="item.icon">
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="blue" dark v-bind:loading="this.$store.state.appLoading">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title :v-text="pageTitle"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="item in addList" v-bind:key="item.key" @click="item.onClick">
            <v-list-item-action v-if="item.icon">
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid></v-container>
    </v-main>

    <v-footer app dense>
      <v-spacer></v-spacer>
      <span>
        <a @click="openGithub">
          <v-icon size="20">mdi-github</v-icon>vigneshpa
        </a>
        &copy; {{ new Date().getFullYear() }} GPL3
      </span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import "@/assets/common.scss";
export default Vue.extend({
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    page: "dashboard" as Page,
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
        key: 1,
        onClick: () => {},
        icon: "mdi-view-dashboard",
      },
      { title: "Settings", key: 2, onClick: () => {}, icon: "mdi-cog" },
    ],
  }),
  computed:{
    pageTitle():string{
      let title: string;
      switch (this.page) {
        case "dashboard":
          title = "Dashboard";
          break;
        case "settings":
          title = "Settings";
          break;
        default:
          title = "Chit Management Syatem";
      }
      return title;
    },
  },
  methods: {
    openGithub(ev: Event) {
      ev.preventDefault();
      window.openExternal("https://github.com/vigneshpa");
    },
  },
  created() {},
});
</script>
<style>
html {
  overflow-x: hidden;
  overflow-y: hidden;
  overflow: hidden;
}
</style>