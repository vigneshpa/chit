<template>
<!-- svelte-ignore a11y-missing-attribute -->
<div class="t-nav">
  <a on:click={()=>store_drawer.set(!$store_drawer)} class="material-icons" style="font-size:24px;">menu</a>
  <slot></slot>
</div>
</template>
<script lang="ts">
  if(!window.ttheme) new Error('Please initilze theme');
  let store_drawer = window.ttheme.store.drawer;
</script>
<style lang="scss">
@use "./scheme.scss" as scheme;
.t-nav {
  padding: 0px;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  box-sizing: border-box;
  background-color: scheme.$primary;
  display: flex;
  box-shadow: 0px 0px 5px scheme.$shadowColor;
  justify-content: space-between;
  :global(a), :global(span) {
    line-height: scheme.$nav1in3;
    font-size:1rem;
    padding: scheme.$nav1in3 15px scheme.$nav1in3 15px;
    text-decoration: none;
    color: scheme.$textOnPrimary;
    transition: background-color scheme.$aniDuration ease;
    user-select: none;
    cursor: pointer;
    &:hover {
      background-color: scheme.$highlight;
    }
  }
  :global(span) {
    cursor: default;
    &:hover {
      background-color: rgba(0, 0, 0, 0);
    }
  }
}
</style>