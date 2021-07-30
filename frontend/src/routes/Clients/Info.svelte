<script lang="ts">
  import { Page } from '@theme/';
  export let route_params: any = {};
  window['svelte-router'].params.subscribe(pms => (route_params = pms));
</script>

<template>
  <Page heading="Client {route_params.client}">
    <p>This a test content</p>
  </Page>
</template>
