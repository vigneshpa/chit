<template lang="pug">
transition(name="t-fade")
  .drawer-cover(v-if="drawer && mobile", @click="drawer = false")
.t-drawer(:class="{ hidden: !drawer }")
  slot
</template>
<script lang="ts">
import { defineComponent, watch } from "vue";
export default defineComponent({
  data() {
    return this.$TTheme.store;
  },
  watch: {
    $route(to, from) {
      this.drawer = !this.mobile;
    }
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

  font-size: 1.2rem;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;

  transition: all scheme.$aniDuration ease;
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
    transition: all scheme.$aniDuration ease;

    &:hover {
      background-color: scheme.$highlight;
    }

    &.router-link-exact-active {
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