<template lang="pug">
.t-icon-text-container
  span.t-icon(
    :class="{ 'material-icons': !outlined, 'material-icons-outlined': outlined }",
    v-text="icon"
  )
  span.t-icon-text
    slot
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    icon: {
      type: String,
      required: false
    },
    outlined: {
      type: Boolean,
      required: false,
      default: false
    }
  }
});
</script>
<style lang="scss">
@use "./scheme.scss" as scheme;
.t-icon-text-container {
  .t-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    color: scheme.$textOnBackgroundLight;
    margin-right: 10px;
  }
  .t-icon-text {
    margin-top:0.16rem;
    display: inline-block;
  }
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>