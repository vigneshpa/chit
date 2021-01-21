<template lang="pug">
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
export default Vue.extend({
  name: "user-details",
  data: () => {
    return {
      details: {
        name: "",
        uuid: "",
        address: "",
      } as UserD,
    };
  },
  mounted(){
    this.fetchdata()
  },
  watch: {
    uuid() {
      this.fetchdata()
    },
  },
  props: ["uuid"],
  methods:{
    async fetchdata(){
      console.log("Getting " + this.uuid + "'s user data");
      this.details = <UserD>await window.ipcirenderer.callMethod("dbQuery", {
        query: "userDetails",
        uuid: this.uuid,
      });
    }
  }
});
</script>
