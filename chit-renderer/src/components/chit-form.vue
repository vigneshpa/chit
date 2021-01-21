<template lang="pug">
  create-user(v-if="type=='addUser'" :close="close")
  create-group(v-else-if="type=='addGroup'", :close="close")
</template>
<script lang="ts">
import Vue from "vue";
import CreateGroup from "@/components/forms/CreateGroup.vue";
import CreateUser from "@/components/forms/CreateUser.vue";
export default Vue.extend({
  props: ["type", "close"],
  components: {
    "create-group": CreateGroup,
    "create-user": CreateUser,
  },
});
</script>
