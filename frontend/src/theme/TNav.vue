<template lang="pug">
.t-nav
  a.material-icons(@click="this.$TTheme.store.drawer = !this.$TTheme.store.drawer" style="font-size:24px;") menu
  slot
</template>
<style lang="scss">
@use "./scheme.scss" as scheme;
.t-nav {
  padding: 0px;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  box-sizing: border-box;
  background-color: scheme.$primary;
  display: flex;
  box-shadow: 0px 0px 5px scheme.$shadowColor;
  justify-content: space-between;
  span,
  a {
    line-height: scheme.$nav1in3;
    font-size:1rem;
    padding: scheme.$nav1in3 15px scheme.$nav1in3 15px;
    text-decoration: none;
    color: scheme.$textOnPrimary;
    transition: background-color 0.3s ease;
    user-select: none;
  }
  span {
    font-size: 1.05rem;
  }
  a {
    cursor: pointer;
    &:hover {
      background-color: scheme.$highlight;
    }
  }
}
</style>