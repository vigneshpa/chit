<script lang="ts">
  import { Page, IconText } from '@theme/';
</script>

<template>
  <Page heading="Create a new User" backButton>
    <div slot="top-extra">
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a href="javascript:alert('hello')" class="a-btn"><IconText icon="close">Clear</IconText></a>
    </div>
    <p>This a test content</p>
  </Page>
</template>
