<script lang="ts">
  import Page from '@theme/Page.svelte';
  import { downloadBackup, restoreBackup } from '../api';
</script>

<template>
  <Page heading="Backup and restore">
    <h3>Backup</h3>
    <button class="t-btn" on:click={() => downloadBackup()}>Download Backup</button>
    <h3>Restore</h3>
    <button class="t-btn" on:click={() => restoreBackup()}>Restore Backup</button>
  </Page>
</template>
