<script lang="ts">
  import { slide as trans } from 'svelte/transition';
  import getStore from './TStore';
  const store = getStore();
  let store_drawer = store.drawer;
  export let loading: boolean = true;
</script>

<template>
  {#if loading}
    <div class="t-nav-loading" transition:trans>
      <div class="line" />
      <div class="subline inc" />
      <div class="subline dec" />
    </div>
  {/if}
  <div class="t-nav">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click={() => store_drawer.set(!$store_drawer)} class="material-icons-outlined" style="font-size:24px;"
      >{$store_drawer ? 'menu_open' : 'menu'}</a
    >
    <slot />
  </div>
</template>

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
    align-items: center;
    box-shadow: 0px 0px 5px scheme.$shadowColor;
    justify-content: space-between;
    :global {
      a,
      span {
        line-height: scheme.$nav1in3;
        font-size: 1.5rem;
        padding: scheme.$nav1in3 15px scheme.$nav1in3 15px;
        text-decoration: none;
        color: scheme.$textOnPrimary;
        transition: background-color scheme.$aniDuration ease;
        user-select: none;
        max-width: 24px;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          background-color: scheme.$highlight;
        }
      }
      span {
        cursor: default;
        &:hover {
          background-color: rgba(0, 0, 0, 0);
        }
      }
      .title {
        max-width: unset;
        font-size: 1rem;
      }
    }
  }
  .t-nav-loading {
    position: fixed;
    width: 100%;
    height: 5px;
    top: scheme.$navSize;
    left: 0px;
    right: 0px;
    overflow-x: hidden;

    .line {
      position: absolute;
      opacity: 0.4;
      background: scheme.$primary;
      width: 150%;
      height: 5px;
    }

    .subline {
      position: absolute;
      background: scheme.$primaryLight;
      height: 5px;
    }
    .inc {
      animation: increase 2s infinite;
    }
    .dec {
      animation: decrease 2s 0.5s infinite;
    }

    @keyframes increase {
      from {
        left: -5%;
        width: 5%;
      }
      to {
        left: 130%;
        width: 100%;
      }
    }
    @keyframes decrease {
      from {
        left: -80%;
        width: 80%;
      }
      to {
        left: 110%;
        width: 10%;
      }
    }
  }
</style>
