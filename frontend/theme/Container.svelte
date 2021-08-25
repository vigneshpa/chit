<script lang="ts">
  import getStore from './TStore';
  const store = getStore();
  const store_drawer = store.drawer;
  const store_mobile = store.mobile;
</script>

<template>
  <div class="t-container" class:shrinked={$store_drawer && !$store_mobile}>
    <slot />
  </div>
</template>

<style lang="scss">
  @use "./scheme.scss" as scheme;
  .t-container {
    margin-top: scheme.$navSize;
    transition: margin scheme.$aniDuration ease;
    &.shrinked {
      margin-left: scheme.$drawerWidth;
    }
  }
</style>
