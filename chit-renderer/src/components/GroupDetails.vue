<template lang="pug">
  v-card
    v-card-title {{ details.name }}
    v-divider
    v-card-text
      v-list
        v-list-item
          v-list-item-content Group Identity String
          v-list-item-content {{ details.uuid }}
        v-list-item
          v-list-item-content Batch
          v-list-item-content {{ details.batch }}
        v-list-item
          v-list-item-content Month
          v-list-item-content {{ month }}
        v-list-item
          v-list-item-content Year
          v-list-item-content {{ details.year }}
        v-list-item
          v-list-item-content Members
          v-list-item-content {{ details.members }}
</template>
<script lang="ts">
import moment from "moment";
import Vue from "vue";
export default Vue.extend({
  name: "group-details",
  data: () => {
    return {
      details: {
        name: "",
        batch: "",
        month: 1,
        year: 0,
        chits: [],
        uuid: "",
        members: [],
      } as GroupD,
      month:""
    };
  },
  mounted() {
    this.fetchdata();
  },
  watch: {
    uuid() {
      this.fetchdata();
    },
  },
  props: ["uuid"],
  methods: {
    async fetchdata() {
      console.log("Getting " + this.uuid + "'s group data");
      this.details = <GroupD>await window.ipcirenderer.callMethod("dbQuery", {
        query: "groupDetails",
        uuid: this.uuid,
      });
      this.month = moment().month(this.details.month).format("MMMM");
    },
  },
});
</script>
