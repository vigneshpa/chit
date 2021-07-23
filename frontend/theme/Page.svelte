<script lang="ts">
  import { slide as trns } from 'svelte/transition';
  let store_mobile = window.ttheme.store.mobile;
  window.ttheme.store.drawer.set(!$store_mobile);
  export let backButton: boolean = false;
  export let heading: string;
</script>

<template>
  <div class="page" transition:trns>
    <div class="top">
      {#if backButton}
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="javascript:history.back()" class="t-a-btn"><span class="material-icons">arrow_back</span></a>
      {/if}
      <div class="heading">{heading}</div>
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
      .t-a-btn {
        height: 34px;
        display:inline-block;
        box-sizing: border-box;
        border-radius: 17px;
        width: 34px;
      }
      .heading {
        font-size: 1.5em;
      }
      border-bottom: solid 2px $textOnBackground;
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: space-between;
      div {
        display: inline-block;
      }
    }
    .content {
      padding: 10px;
    }
  }
</style>
