<template lang="pug">
transition(name="t-fade")
  .t-confirm(v-if="$TTheme.store.confirm")
    .t-confirm-cover
    .t-confirm-box
      button(@click="$TTheme.store.confirm=false") Close
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  mounted() {
    // this.$TTheme.store.confirm = true;
  }
});
</script>
<style lang="scss">
@use "./scheme.scss";
.t-confirm {
  position: fixed;
  overflow: auto;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: scheme.$coverColor;
}
</style>