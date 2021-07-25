<script lang="ts">
  import { Page } from '@theme/';
  import { writable } from 'svelte/store';
  export let route_params:any = {};
  window['svelte-router'].params.subscribe(pms => (route_params = pms));
</script>

<template>
  <Page heading="User {route_params.user}">
    <p>This a test content</p>
  </Page>
</template>
