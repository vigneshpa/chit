<template>
<div class="t-icon-text-container">
  <span class="t-icon" class:material-icons={outlined} class:material-icons-outlined={outlined} > {icon} </span>
  <span class="t-icon-text">
    <slot></slot>
  </span>
</div>
</template>
<script lang="ts">
  export let icon:string;
  export let outlined:boolean;
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