<script lang='ts'>
  import {Page} from '@theme/';
  export let params:any = null;
  let user = params?.user||'';
</script>
<template lang="pug">
Page(heading=`User ${user}`)
  p This a test content
</template>