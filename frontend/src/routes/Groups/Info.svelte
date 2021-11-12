<script lang="typescript">
  export let group: any;
</script>

<template>
  <div class="container">
    <div class="top"><span class="heading">Batch {group.name}</span></div>
    <div class="info">
      name: {group.name}<br />
      year: {group.year}<br />
      month: {group.month}<br />
      batch: {group.batch}<br />
      value: {group.totalValue}<br />
    </div>
  </div>
</template>

<style lang="scss">
  .container {
    margin: 0px;
    padding: 1rem;
    .top {
      padding: 0.2rem;
      border-bottom: solid 1px grey;
      .heading {
        margin: 0.2em;
        padding: 0.4em;
        display: inline-block;
        font-size: 1.2em;
      }
    }
    .info {
      padding: 1rem;
      line-height: 1.5rem;
    }
  }
</style>
