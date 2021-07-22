<template>
  <div class="t-grid">
    <slot />
  </div>
</template>

<style lang="scss" global>
  @use './scheme.scss' as scheme;
  .t-grid {
    display: grid;
    grid-template-columns: auto auto auto;
    > div {
      box-shadow: 0px 0px 2px scheme.$shadowColor;
      padding:10px;
      margin:10px;
      // border-radius:5px;
    }
  }
  @media only screen and (max-width: 1080px + scheme.$drawerWidth){
    .t-grid{
      grid-template-columns: auto auto;
    }
  }
  @media only screen and (max-width: 720px){
    .t-grid{
      grid-template-columns: auto;
    }
  }
</style>
