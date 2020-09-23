<template>
  <create-user v-if="form === 'addUser'" v-bind:key="'app'"></create-user>
  <create-group v-else-if="form === 'addGroup'" v-bind:key="'app'"></create-group>
</template>
<script lang="ts">
import CreateUser from "./CreateUser.vue";
import CreateGroup from "./CreateGroup.vue";
import Vue from "vue";

const url = new URL(window.location.href);
const form = url.searchParams.get("form");
console.log(form);

export default Vue.extend({
  data: () => {
    return { form };
  },
  components: {
    CreateUser,
    CreateGroup,
  },
  mounted(){
      window.resizeWindowToCard();
  }
});
window.resizeWindowToCard = function () {
  setTimeout(() => {
    window.resizeTo(
      550,
      document.getElementById("container")!.offsetHeight + 42
    );
  }, 350);
};
</script>