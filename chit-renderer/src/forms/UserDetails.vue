<template lang="pug">
v-app#1_app
  v-main
    v-container#container
      v-card
        v-card-title {{ details.name }}
        v-divider
        v-card-text
          v-list
            v-list-item
              v-list-item-content User Identity Number
              v-list-item-content {{ details.UID }}
            v-list-item
              v-list-item-content Phone Number
              v-list-item-content {{ details.phone }}
            v-list-item
              v-list-item-content Address
              v-list-item-content {{ details.address }}
            v-list-item
              v-list-item-content
                | Active in
                | {{ details.noOfActiveBatches }} Batches.
            v-list-item
              v-list-item-content Groups
              v-list-item-content {{ details.groups }}
</template>
<script lang="ts">
import Vue from "vue";
const url = new URL(window.location.href);
let uuid = url.searchParams.get("uuid");
export default Vue.extend({
  data: () => {
    return {
      details: {} as UserD,
    };
  },
  mounted() {
    console.log("Getting " + uuid + "'s user data");
    window.ipcrenderer.once("get-user-details", (event, data) => {
      this.details = data;
      window.document.title = this.details.name + "'s Profile";
    });
    window.ipcrenderer.send("get-user-details", uuid);
  },
});
</script>