<template lang='pug'>
  .page
    .heading
      h3 {heading}
    .content
      slot
</template>
<script lang="ts">
  export let heading:string;
</script>
<style lang="scss">
  @import './scheme.scss';
  .page{
    margin:20px;
    padding:20px;
    & .heading{
      color:$textOnBackground
    }
  }
</style>