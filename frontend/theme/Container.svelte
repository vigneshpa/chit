<template>
<div class="t-container" class:shrinked="{ store_drawer && !store_mobile }">
<slot></slot>
</div>
</template>

<script lang="ts">
  if(!window.ttheme) new Error('Please initilze theme');
  let store = window.ttheme.store;
  let store_drawer:boolean;
  store.drawer.subscribe(value=>store_drawer=value);
  let store_mobile:boolean;
  store.mobile.subscribe(value=>store_mobile=value);
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