<template lang="pug">
v-list-group(prepend-icon="mdi-account-group", no-action)
  template(v-slot:activator)
    v-list-item-content
      v-list-item-title {{ members.length }} Members
  v-fab-transition(group)
    v-list-item(
      v-for="member in members",
      :key="member.info.uuid + 'memberDetail'",
      @click="empty"
      )
      v-list-item-content(:title="member.info.phone + '\\n' + member.info.address") {{ member.info.name }}
      v-chip
        |{{member.noOfChits}}
        v-icon(v-if="member.paidInitial" title="This tick indicates member has paid the initial amount.") mdi-check
      v-list-item-action(
        v-if="((!disableInputs)&&(removeMember))"
        @click="removeMember(member)",
        )
        v-icon mdi-close-circle
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    empty() {},
  }),
  props: ["members", "disableInputs", "removeMember"],
});
</script>
