<script lang="ts">
  import { fade } from 'svelte/transition';
  import getStore from './TStore';
  const store = getStore();
  let store_drawer = store.drawer;
  let store_mobile = store.mobile;
</script>

<template>
  {#if $store_mobile && $store_drawer}
    <div class="drawer-cover" transition:fade on:click={() => store_drawer.set(false)} />
  {/if}
  <div class="t-drawer" class:hidden={!$store_drawer}><slot /></div>
</template>

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
    box-shadow: scheme.$shadow;
    overflow: auto;
    padding: 20px 0px 10px 0px;

    font-size: 1.2rem;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;

    transition: transform scheme.$aniDuration ease;
    &.hidden {
      transform: translateX(-102%);
    }
    :global {
      a {
        color: scheme.$textOnBackground;
        width: 100%;
        box-sizing: border-box;
        text-decoration: none;
        padding: 10px;
        transition: background-color scheme.$aniDuration ease, border scheme.$aniDuration ease;

        &:hover {
          background-color: scheme.$highlight;
        }
        &:active {
          background-color: scheme.$highlightDark;
        }
      }
      .linkactive {
        font-weight: bold;
        border-right: solid 0.3rem scheme.$primaryLight;
      }
    }
  }
  .drawer-cover {
    position: fixed;
    top: scheme.$navSize;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: scheme.$coverColor;
  }
</style>
