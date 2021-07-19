<template lang='pug'>
  .page(transition:trns)
    .top
      span.headding {heading}
      slot(name='top-extra')
    .content
      slot
</template>
<script lang="ts">
  import { slide as trns } from 'svelte/transition';
  let store_mobile = window.ttheme.store.mobile;
  window.ttheme.store.drawer.set(!$store_mobile);
  export let heading:string;
</script>
<style lang="scss">
  @import './scheme.scss';
  .page{
    margin:0px;
    padding:10px;
    & .top{
      color:$textOnBackground;
      font-size: 1.5em;
      border-bottom: solid 2px $textOnBackground;
      padding:10px;
    }
    & .content{
      padding:10px;
    }
  }
</style>