<script lang="ts">
  if (!window.ttheme) new Error('Please initilze theme');
  export let show: boolean = true;
  console.log($$slots);
</script>

<template>
  {#if show}
    <div class="t-confirm" on:click={() => (show = false)}>
      <slot />
    </div>
  {/if}
</template>

<style lang="scss">
  @use "./scheme.scss";
  .t-confirm {
    position: fixed;
    overflow: auto;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-color: scheme.$coverColor;
    z-index: +10;
  }
</style>
