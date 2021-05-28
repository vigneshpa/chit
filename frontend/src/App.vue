<template lang="pug">
router-view#view
#drawer
  router-link(to="/") Home
  router-link(to="/about") About
#nav
  span Chit Managemnet System
  a(href="/api/logout") Logout
</template>

<style lang="scss">
@use "sass:math";


//colors
$background: rgb(255, 255, 255);
$backgroundNeg: rgb(0, 0, 0);
$fontColor: rgb(68, 68, 68);
$fontColor1: rgb(46, 46, 46);
$shadowColor: grey;

//size
$navSize: 60px;
$drawerWidth: 250px;

#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $fontColor;
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
  background-color: $background;
  display: flex;
  box-shadow: 0px 0px 5px $shadowColor;
  justify-content: space-between;
  span,
  a {
    line-height: $nav1in3;
    padding: $nav1in3 15px $nav1in3 15px;
    text-decoration: none;
    color: $fontColor;
    background-color: $background;
    transition:background-color 0.3s ease;
  }
  a:hover {
    background-color: mix($background, $backgroundNeg, 85);
  }
}
#drawer {
  position: fixed;
  top:$navSize;
  left:0px;
  bottom: 0px;
  width:$drawerWidth;
  background-color: $background;
  box-shadow: 0px 0px 5px $shadowColor;
  a {
    font-weight: bold;
    color: $fontColor;

    &.router-link-exact-active {
      color: $fontColor1;
    }
  }
}
#view{
  margin-top: $navSize;
}
</style>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    const drawer = ref(false);
    return { drawer };
  }
});
</script>