<script lang="typescript">
  export let group: any;
</script>

<template>
  <div class="container">
    <div class="top"><span class="heading">Batch {group.name}</span></div>
  </div>
</template>

<style lang="scss">
  .container {
    margin: 0px;
    padding: 0.2em;
    .top {
      padding: 0.2em;
      border-bottom: solid 1px grey;
      .heading {
        margin: 0.2em;
        padding: 0.4em;
        display: inline-block;
        font-size: 1.2em;
      }
    }
  }
</style>
