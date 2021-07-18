<template>
  {#if store_mobile&&store_drawer}
    <div class="drawer-cover" transition:fade on:click={()=>store.drawer.set(false)}></div>
  {/if}
  <div class="t-drawer" class:hidden="{ !store_drawer }"><slot></slot></div>
</template>
<script lang="ts">
  import {fade, fly} from 'svelte/transition';
  if(!window.ttheme) new Error('Please initilze theme');
  let store = window.ttheme.store;
  let store_drawer:boolean;
  store.drawer.subscribe(value=>store_drawer=value);
  let store_mobile:boolean;
  store.mobile.subscribe(value=>store_mobile=value);
</script>
<style lang="scss">
@use "./scheme.scss" as scheme;
.t-drawer {
  position: fixed;
  top: scheme.$navSize;
  left: 0px;
  bottom: 0px;
  width: scheme.$drawerWidth;
  box-sizing: border-box;
  background-color: scheme.$background;
  box-shadow: 0px 0px 5px scheme.$shadowColor;
  overflow: auto;
  padding: 20px 0px 10px 0px;

  font-size: 1.2rem;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;

  transition: all scheme.$aniDuration ease;
  &.hidden {
    transform: translateX(-100%);
  }
  :global(a) {
    color: scheme.$textOnBackground;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    padding: 10px;
    transition: all scheme.$aniDuration ease;

    &:hover {
      background-color: scheme.$highlight;
    }
    &:active{
      background-color: scheme.$highlightDark;
    }

    &:global(.link-active) {
      font-weight: bold;
      border-right: solid 0.3rem scheme.$primaryLight;
    }
  }
}
.drawer-cover {
  position: absolute;
  top: scheme.$navSize;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: scheme.$coverColor;
}
</style>