<template lang="pug">
slot
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  mounted() {
    const store = this.$TTheme.store;
    const resizeHandler = () => {
      store.mobile = window.innerWidth < 960;
      store.drawer = !store.mobile;
    };
    window.onresize = resizeHandler;
    resizeHandler();
  }
});
</script>
<style lang="scss">
@use "./scheme.scss" as scheme;
#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: scheme.$textOnBackground;
}
.t-fade-enter-active,
.t-fade-leave-active {
  transition: opacity scheme.$aniDuration ease;
}

.t-fade-enter-from,
.t-fade-leave-to {
  opacity: 0;
}
</style>