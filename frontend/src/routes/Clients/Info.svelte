<script lang="ts">
  import { action } from '@/api';
  import Page from '@theme/Page.svelte';
  const params = window['svelte-router'].params;
  let details: any = {};
  action('clientDetails').then(ret => (details = ret));
</script>

<template>
  <Page heading="Client {$params.client}">
    <p>This a test content</p>
  </Page>
</template>
