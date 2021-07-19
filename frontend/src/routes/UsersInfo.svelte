<script lang="ts">
  import { Page } from '@theme/';
  import { writable } from 'svelte/store';
  export let route_params = writable({ user: '' });
</script>

<template>
  <Page heading="User {$route_params.user}">
    <p>This a test content</p>
  </Page>
</template>
