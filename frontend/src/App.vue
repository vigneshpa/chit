<template lang="pug">
t-app
  t-container
    router-view
  t-drawer
    router-link(to="/")
      t-icon-text(icon="space_dashboard" outlined) Dashboard
    router-link(to="/about")
      t-icon-text(icon="info" outlined) About
  t-nav
    span Chit Managemnet System
    a(href="/api/logout") Logout
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>