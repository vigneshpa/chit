<template lang="pug">
t-app
  t-container
    transition(name="t-fade")
      router-view
  t-drawer
    router-link(to="/")
      t-icon-text(icon="space_dashboard", outlined) Dashboard
    router-link(to="/users")
      t-icon-text(icon="people" outlined) Users
    router-link(to="/about")
      t-icon-text(icon="info", outlined) About
  t-nav
    span Chit Managemnet System
    a(href="/api/logout") Logout
  t-confirm
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>