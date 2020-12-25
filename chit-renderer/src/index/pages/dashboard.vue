<template lang="pug">
v-container#dashboard(fluid)
  | Dashboard goes here.
  v-img(src="@/assets/logo.png", width="500")
  v-img(src="@/assets/logo.png", width="500")
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>
<style lang="scss">
#dashboard {
  background-color: rgba($color: #ffa6006e, $alpha: 1);
}
</style>