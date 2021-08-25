<script lang="ts">
  import { slide as trns } from 'svelte/transition';
  import getStore from './TStore';
  const store = getStore();
  let store_mobile = store.mobile;
  store.drawer.set(!$store_mobile);
  export let backButton: boolean = false;
  export let heading: string;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
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
    transition: padding $aniDuration ease;
    @media only screen and (max-width: 720px) {
      padding: 10px 5px;
    }
    .top {
      color: $textOnBackground;
      .t-a-btn {
        height: 34px;
        display: inline-block;
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
      transition: padding $aniDuration ease;
      @media only screen and (max-width: 720px) {
        padding: 10px 0px;
      }
    }
  }
</style>
