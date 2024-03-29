<script lang="ts">
  import { setContext } from 'svelte';
  import type { TStore } from './TStore';
  import { Writable, writable } from 'svelte/store';
  let store: TStore = {
    mobile: writable(true) as Writable<boolean>,
    drawer: writable(false) as Writable<boolean>,
  };
  const resizeHandler = () => {
    const isMobile = window.innerWidth < 960;
    store.mobile.set(isMobile);
    store.drawer.set(!isMobile);
  };
  window.addEventListener('resize', resizeHandler);
  resizeHandler();
  setContext('ttheme-store', store);
</script>

<template>
  <div class="t-app">
    <slot />
  </div>
</template>

<style lang="scss" global>
  @use "./scheme.scss" as scheme;
  @import url(https://fonts.googleapis.com/css2?family=Roboto&display=swap);
  @import url(https://fonts.googleapis.com/icon?family=Material+Icons+Outlined&display=swap);
  body {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: scheme.$textOnBackground;
    -webkit-tap-highlight-color: transparent;
  }
  .t-a-btn {
    text-decoration: none;
    color: inherit;
    display: inline-block;
    padding: 5px;
    transition: background-color scheme.$aniDuration ease;
    &:hover {
      background-color: scheme.$highlight;
      box-shadow: 0px 0px 2px scheme.$shadowColor;
    }
  }
  .t-btn {
    text-decoration: none;
    background-color: scheme.$primary;
    color: scheme.$textOnPrimary;
    &.secondary {
      background-color: scheme.$secondary;
      color: scheme.$textOnSecondary;
    }
    transition: background-color scheme.$aniDuration ease;
    border: none;
    box-shadow: 0px 0px 0px scheme.$shadowColor;
    border-radius: 3px;
    font-size: 1em;
    padding: 0.7em;
    &:hover {
      background-color: scheme.$primaryDark;
      box-shadow: 0px 0px 2px scheme.$shadowColor;
    }
    &:active {
      background-color: scheme.$primary;
      box-shadow: 0px 0px 2px scheme.$shadowColor;
    }
  }
  .t-shadow {
    box-shadow: 0px 0px 2px scheme.$shadowColor;
    border-radius: 3px;
  }
  form {
    label {
      display: block;
      margin-top: 1.5em;
      padding: 5px;
      font-size: 1em;
      &:first-of-type {
        margin-top: 0;
      }
    }
    input[type='text'],
    input[type='number'],
    textarea,
    select {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      font-size: 1em;
      border: solid 1px grey;
      border-radius: 5px;
      margin: 0px;
      outline: none;
      &:focus {
        box-shadow: 0px 0px 2px grey;
        &:invalid {
          border: solid 1px rgb(173, 47, 47);
        }
        &:valid {
          border: solid 1px rgb(76, 173, 47);
        }
      }
    }
    textarea {
      resize: none;
      height: 10em;
    }
    input[type='submit'] {
      display: block;
      text-align: center;
      margin: 20px auto;
      cursor: pointer;
    }
    .message {
      color: rgb(172, 53, 53);
      padding: 5px;
      font-size: 0.8em;
    }
  }
</style>
