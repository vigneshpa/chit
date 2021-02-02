<template lang="pug">
v-app#1_app
  v-dialog(v-model="confirmO.visible" max-width="500")
    v-card
      v-card-title {{confirmO.title}}
      v-card-text {{confirmO.message}}
      v-card-actions
        v-spacer
        v-btn(@click="confirmO.handle(false)") Cancel
        v-btn(@click="confirmO.handle(true)" color="primary") OK

  v-dialog(v-model="form.visible" max-width="500")
    chit-form(v-if="form.visible" :type="form.type" :close="()=>form.visible = false")
  v-navigation-drawer(v-model="drawer", app, clipped)
    v-list(dense)
      v-list-item(
        v-for="item in $router.options.routes",
        v-bind:key="item.path",
        :to="item.path",
        active-class="router-link-active",
        exact
        )
        v-list-item-action(v-if="item.meta.icon")
          v-icon {{ item.meta.icon }}
        v-list-item-content
          v-list-item-title {{ item.name }}
      v-list-item(
        @click="confim('Are you sure want to logout?', 'Logout').then(val => {if(val)window.location.href = '/api/logout';})"
        v-if="isOnline"
        bottom
        )
        v-list-item-action
          v-icon mdi-power
        v-list-item-content
          v-list-item-title Log Out

  v-app-bar(
    app,
    clipped-left,
    color="blue",
    dark
    )
    v-progress-linear(
      :active="appLoading"
      indeterminate
      bottom
      absolute
      color="white"
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
          v-for="item, index in addList",
          v-bind:key="index",
          @click="openForm(item.form)"
        )
          v-list-item-action(v-if="item.icon")
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title {{ item.title }}

  v-main
    v-expand-transition
      router-view

  v-footer(app, dense)
    span {{ config.databaseFile.location }}
    v-spacer
    span
      a(@click="openGithub")
        v-icon(size="20") mdi-github
        | vigneshpa/chit
      a(@click="openGithubLicense")  GPL-3.0 &copy; {{ new Date().getFullYear() }} Vignesh
</template>

<script lang="ts">
import Vue from "vue";
type FormType = "addUser" | "addGroup";
export default Vue.extend({
  props: {
    source: String,
  },
  data: () => ({
    drawer: true as boolean,
    config: window.config,
    addList: [
      {
        title: "Add User",
        form: "addUser",
        icon: "mdi-account-plus",
      },
      {
        title: "Create Group Template",
        form: "addGroup",
        icon: "mdi-account-multiple-plus",
      },
      {
        title: "Create a Chit",
      }
    ],
    appLoading: true,
    form: {
      type: "" as FormType,
      visible: false,
    },
    isOnline: window?.isOnline,
    confirmO: {
      visible: false as boolean,
      title: "Confirm" as string,
      message: "" as string,
      handle(value: boolean) {
        this.visible = false;
      },
    },
    window
  }),
  computed: {
    pageTitle() {
      if (this.$route?.name) return this.$route.name;
      return "Chit Management System";
    },
  },
  watch: {
    pageTitle() {
      window.document.title = this.pageTitle;
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
    confim(message: string, title?: string) {
      return new Promise( (resolve:(value:boolean)=>void) => {
        this.confirmO.message = message;
        this.confirmO.title = title || "Confirm";
        this.confirmO.handle = (value)=>{
          this.confirmO.visible = false;
          resolve(value);
        };
        this.confirmO.visible = true;
      });
    },
  },
  components: {
    "chit-form": () => import("@/components/chit-form.vue"),
  },
  mounted() {
    this.$router.beforeEach((to, from, next) => {
      this.appLoading = true;
      next();
    });
    this.$router.afterEach((to, from) => (this.appLoading = false));
  },
});

window.ipcirenderer
  .callMethod("ping")
  .then((e: any) => console.log("Got pong from the renderer"));
console.log("Sent ping to the renderer.");
</script>
<style>
html {
  overflow: auto;
}
.v-navigation-drawer {
  will-change: initial;
}
</style>
