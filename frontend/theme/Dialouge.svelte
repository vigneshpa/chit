<script lang="ts">
  import { fade as trans } from 'svelte/transition';
  if (!window.ttheme) new Error('Please initilze theme');
  export let preClose: () => Promise<boolean | void> | boolean | void = () => false;
  export let show: boolean = true;
</script>

<template>
  {#if show}
    <div class="t-confirm">
      <slot />
    </div>
    <div
      class="t-confirm-cover"
      on:click={() => Promise.resolve(preClose()).then(val => (show = !(typeof val === 'boolean' && val)))}
      transition:trans
    />
  {/if}
</template>

<style lang="scss">
  @use "./scheme.scss" as scheme;
  .t-confirm-cover {
    position: fixed;
    overflow: auto;
    top: 0px;
    right: 0px;
    z-index: 1;
    bottom: 0px;
    left: 0px;
    background-color: scheme.$coverColor;
  }
  .t-confirm {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    margin: Auto;
    > :global(div) {
      border-bottom-left-radius:10px;
      border-bottom-right-radius:10px;
      background-color: scheme.$background;
    }
  }
</style>
