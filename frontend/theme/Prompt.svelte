<script lang="ts">
  import { fade as trans } from 'svelte/transition';
  export let preClose: () => Promise<boolean | void> | boolean | void = () => Promise.resolve(false);
  export let show: boolean = true;
</script>

<template>
  {#if show}
    <div class="t-prompt">
      <slot />
      <div class="t-prompt-buttons"><slot name="buttons" /></div>
    </div>
    <div
      class="t-prompt-cover"
      on:click={() => Promise.resolve(preClose()).then(val => !(show = typeof val === 'boolean' && val))}
      transition:trans
    />
  {/if}
</template>

<style lang="scss">
  @use "./scheme.scss" as scheme;
  .t-prompt-cover {
    position: fixed;
    overflow: hidden;
    top: 0px;
    right: 0px;
    z-index: 1;
    bottom: 0px;
    left: 0px;
    background-color: scheme.$coverColor;
  }
  .t-prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    margin: Auto;
    padding: 1em;
    border-radius: 10px;
    box-shadow: scheme.$shadow;
    background-color: scheme.$background;
    text-align: center;
    > :global(div) {
      min-width: 300px;
      min-height: 70px;
    }
    .t-prompt-buttons {
      display: flex;
      min-height: unset;
      align-items: center;
      justify-content: space-evenly;
      :global(button) {
        margin: 0 1em;
      }
    }
  }
</style>
