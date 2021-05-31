<template lang="pug">
.t-container(:class="{ shrinked: this.$TTheme.store.drawer && !this.$TTheme.store.mobile }")
  slot
</template>
<style lang="scss">
@use "./scheme.scss" as scheme;
.t-container{
  margin-top: scheme.$navSize;
  transition: all scheme.$aniDuration ease;
  &.shrinked {
    margin-left: scheme.$drawerWidth;
  }
}
</style>