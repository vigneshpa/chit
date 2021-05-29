<template lang="pug">
router-view#view(:class="{ shrinked: drawer && !mobile }")
#drawer(:class="{ hidden: !drawer }")
  router-link(to="/") Home
  router-link(to="/about") About
#nav
  a.material-icons(@click="drawer = !drawer") menu
  span Chit Managemnet System
  a(href="/api/logout") Logout
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    const mobile = ref(false);
    const resizeHandler = () => {
      mobile.value = window.innerWidth < 960;
    };
    window.onresize = resizeHandler;
    resizeHandler();
    const drawer = ref(!mobile.value);
    return { drawer, mobile };
  }
});
</script>

<style lang="scss">
@use "sass:math";

//theme
$primary: #303f9f;
$primaryLight: #666ad1;
$primaryDark: #001970;
$secondary: #3949ab;
$secondaryLight: #6f74dd;
$secondaryDark: #00227b;
$textOnPrimary: #ffffff;
$textOnSecondary: #ffffff;
$background: rgb(255, 255, 255);
$textOnBackground: rgb(41, 41, 41);
$highlighter: grey;
$shadowColor: grey;

$highlightWeight: 80;

//size
$navSize: 60px;
$drawerWidth: 250px;

//calculations
$highlight: mix(rgba(255, 255, 255, 0), $highlighter, $highlightWeight);

#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $textOnBackground;
}

$nav1in3: math.div($navSize, 3);
#nav {
  padding: 0px;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  box-sizing: border-box;
  background-color: $primary;
  display: flex;
  box-shadow: 0px 0px 5px $shadowColor;
  justify-content: space-between;
  span,
  a {
    line-height: $nav1in3;
    padding: $nav1in3 15px $nav1in3 15px;
    text-decoration: none;
    color: $textOnPrimary;
    transition: background-color 0.3s ease;
    user-select: none;
  }
  span {
    font-size: 1.1em;
  }
  a {
    cursor: pointer;
    &:hover {
      background-color: $highlight;
    }
  }
}
#drawer {
  position: fixed;
  top: $navSize;
  left: 0px;
  bottom: 0px;
  width: $drawerWidth;
  box-sizing: border-box;
  background-color: $background;
  box-shadow: 0px 0px 5px $shadowColor;
  overflow: auto;
  padding: 20px 0px 10px 0px;

  font-size: 1.2em;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;

  transition: all 0.3s ease;
  &.hidden {
    transform: translateX(-100%);
  }
  a {
    color: $textOnBackground;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    padding: 10px;
    transition: all 0.3s ease;

    &:hover {
      background-color: $highlight;
    }

    &.router-link-exact-active {
      font-weight: bold;
      font-size: 1.1em;
    }
  }
}
#view {
  margin-top: $navSize;
  transition: all 0.3s ease;
  &.shrinked {
    margin-left: $drawerWidth;
  }
}
</style>