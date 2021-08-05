<template>
  <table>
    <slot />
  </table>
</template>

<style lang="scss">
  @use './scheme.scss' as scheme;
  table {
    width: 100%;
    :global {
      th {
        text-align: left;
        border-bottom: 1px solid grey;
      }
      th,
      td {
        padding: 0.8em;
        user-select: none;
      }
      tr.fold-view {
        transition: background-color scheme.$aniDuration ease;
      }
      tr.fold-view:nth-child(even) {
        background-color: transparentize(scheme.$highlight, 0.07);
      }
      tr.fold-view:nth-child(odd) {
        background-color: transparentize(scheme.$highlight, 0.15);
      }
      tr.fold-view:hover {
        background-color: scheme.$highlight;
      }
      tr.fold.closed div.fold {
        max-height: 0px;
      }
      tr.fold div.fold {
        transition: max-height scheme.$aniDuration ease;
        max-height: 400px;
        padding: 0px;
        margin: 10px 0px;
        overflow: hidden;
        border: solid 1px grey;
      }
      td.fold {
        padding: 0px;
        margin: 0px;
      }
    }
  }
</style>
