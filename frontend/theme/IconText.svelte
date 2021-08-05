<script lang="ts">
  export let icon: string;
  export let outlined: boolean = false;
</script>

<template>
  <div class="t-icon-text-container">
    <i class="t-icon" class:material-icons={!outlined} class:material-icons-outlined={outlined}> {icon} </i>
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
      overflow: hidden;
    }
    .t-icon-text {
      margin-top: 0.16rem;
      display: inline-block;
      text-decoration: none;
      padding-right: 10px;
    }
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
