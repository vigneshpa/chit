<template>
{#if $store_confirm}
  <div class="t-confirm">
    <div class="t-confirm-cover">
      <div class="t-confirm-box">
        <button on:click={()=>store_confirm.set(false)}>
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
</template>
<script lang="ts">
  if(!window.ttheme) new Error('Please initilze theme');
  let store_confirm = window.ttheme.store.confirm;
  // Sconfirm.set(true);
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