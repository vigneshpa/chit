<template>
  <table>
    <slot />
  </table>
</template>

<style lang="scss">
  @use './scheme.scss' as scheme;
  table {
    width: 100%;
    :global(th) {
      text-align: left;
      border-bottom: 1px solid #ccc;
    }
    :global(th),
    :global(td) {
      padding: 0.4em;
      user-select: none;
    }
    :global(tr.fold-view:hover) {
      background-color: scheme.$highlight;
    }
    :global(tr.fold.closed div.fold) {
      max-height: 0px;
    }
    :global(tr.fold div.fold) {
      transition: max-height 0.3s ease;
      max-height: 400px;
      padding: 0.4em;
      overflow: hidden;
    }
    :global(td.fold) {
      padding: 0px;
      margin: 0px;
    }
  }
</style>
