<script lang="ts">
  import Page from '@theme/Page.svelte';
  import { downloadBackup, restoreBackup } from '../api';
</script>

<template>
  <Page heading="Backup and Restore">
    <h3>Backup</h3>
    <p>To backup all the data in this application download the backup file and store it for future restorations.</p>
    <p>
      The backup file is a digitally signed (with <a href="https://en.wikipedia.org/wiki/HMAC">HMAC</a>) compressed zip archive. If you try to restore
      a corrupted or tampered file it will fail
    </p>
    <button class="t-btn" on:click={() => downloadBackup()}>Download Backup</button>
    <h3>Restore</h3>
    <p>
      To restore a backup that you have made in the past. click the restore backup button and choose the backup file. This action will reload the
      application.
    </p>
    <p>Current application data will be lost. proceed with caution.</p>
    <button class="t-btn" on:click={() => restoreBackup()}>Restore Backup</button>
  </Page>
</template>
