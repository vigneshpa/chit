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

    <v-app-bar app clipped-left color="blue" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Chit Management system</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu
      offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>

        <v-list>
		<v-list-item  v-for="item in addList" v-bind:key="item.key" @click="item.onClick">
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
      <span>vigneshpa &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import "@/assets/common.scss";
export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    addList:[
      {title:"Add User", key:1, onClick:()=>{}, icon:"mdi-account-plus"},
      {title:"Add Group", key:2, onClick:()=>{}, icon:"mdi-account-multiple-plus"}
    ],
	drawerList:[
	  {title:"Dashboard", key:1, onClick:()=>{}, icon:"mdi-view-dashboard"},
	  {title:"Settings", key:2, onClick:()=>{}, icon:"mdi-cog"}
	]
  }),
  created() {},
};
</script>
<style>
html {
  overflow-x: hidden;
  overflow-y: hidden;
  overflow: hidden;
}
</style>