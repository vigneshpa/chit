<script>
  import IconText from '@theme/IconText.svelte';

  import Page from '@theme/Page.svelte';
  import license from './GNU_GPL.html';
</script>

<template>
  <Page heading="" backButton>
    <div slot="top-extra">
      <a href="https://www.gnu.org/licenses/gpl-3.0" target="_blanck" class="t-a-btn"><IconText icon="launch">Get a copy</IconText></a>
    </div>
    {@html license}
  </Page>
</template>
