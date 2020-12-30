<template lang="pug">
create-user(v-if="form === 'addUser'", v-bind:key="'app'")
create-group(v-else-if="form === 'addGroup'", v-bind:key="'app'")
user-details(v-else-if="form === 'UserDetails'", v-bind:key="'app'")
</template>
<script lang="ts">
import CreateUser from "./CreateUser.vue";
import CreateGroup from "./CreateGroup.vue";
import UserDetails from "./UserDetails.vue";
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
    UserDetails,
  },
  mounted() {
    window.resizeWindowToCard();
  },
});
window.resizeWindowToCard = function () {
  setTimeout(function(){
    let cont = document.getElementById("container");
    if(cont)window.resizeTo(
      550,
      cont.offsetHeight + 42
    );
  }, 350);
};
</script>