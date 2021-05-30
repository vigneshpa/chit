<template lang="pug">
t-app
  t-container
    router-view
  t-drawer
    router-link(to="/") Home
    router-link(to="/about") About
  t-nav
    span Chit Managemnet System
    a(href="/api/logout") Logout
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>