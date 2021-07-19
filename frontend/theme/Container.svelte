<template>
<div class="t-container" class:shrinked="{ $store_drawer && !$store_mobile }">
<slot></slot>
</div>
</template>

<script lang="ts">
  if(!window.ttheme) new Error('Please initilze theme');
  const store_drawer = window.ttheme.store.drawer;
  const store_mobile = window.ttheme.store.mobile;
</script>

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