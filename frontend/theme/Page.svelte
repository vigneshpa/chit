<script lang="ts">
  import { slide as trns } from 'svelte/transition';
  let store_mobile = window.ttheme.store.mobile;
  window.ttheme.store.drawer.set(!$store_mobile);
  export let heading: string;
</script>

<template>
  <div class="page" transition:trns>
    <div class="top">
      <span class="heading">{heading}</span>
      <slot name="top-extra" />
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
  @import './scheme.scss';
  .page {
    margin: 0px;
    padding: 10px;
    .top {
      color: $textOnBackground;
      .heading {
        font-size: 1.5em;
      }
      border-bottom: solid 2px $textOnBackground;
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-end;
      justify-content: space-between;
    }
    .content {
      padding: 10px;
    }
  }
</style>
