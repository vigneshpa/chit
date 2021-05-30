<template lang="pug">
.t-drawer(:class="{ hidden: !drawer }")
  slot
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return this.$TTheme.store;
  }
});
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
    color: scheme.$textOnBackground;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    padding: 10px;
    transition: all 0.3s ease;

    &:hover {
      background-color: scheme.$highlight;
    }

    &.router-link-exact-active {
      font-weight: bold;
      font-size: 1.1em;
    }
  }
}
</style>