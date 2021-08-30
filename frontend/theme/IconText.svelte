<script lang="ts">
  export let icon: string;
  export let justifyContent: 'left' | 'right' | 'center' = 'center';
</script>

<template>
  <div class="t-icon-text-container" style="justify-content:{justifyContent}">
    <i class="t-icon material-icons-outlined"> {icon} </i>
    <span class="t-icon-text">
      <slot />
    </span>
  </div>
</template>

<style lang="scss">
  @use "./scheme.scss" as scheme;
  .t-icon-text-container {
    .t-icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      color: scheme.$textOnBackgroundLight;
      margin-right: 10px;
      margin-left: 10px;
      overflow: hidden;
    }
    .t-icon-text {
      display: inline-block;
      text-decoration: none;
      padding-right: 10px;
    }
    display: flex;
    align-items: center;
  }
</style>
