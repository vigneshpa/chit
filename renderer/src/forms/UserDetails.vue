<template>
  <v-app id="1_app">
    <v-main>
      <v-container id="container">
        <v-card>
          <v-card-title>{{ details.name }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>User Identity Number</v-list-item-content>
                <v-list-item-content> {{ details.UID }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Phone Number</v-list-item-content>
                <v-list-item-content> {{ details.phone }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Address</v-list-item-content>
                <v-list-item-content> {{ details.address }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Active in {{details.noOfActiveBatches}} Batches.</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Groups</v-list-item-content>
                <v-list-item-content> {{ details.groups }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Vue from "vue";
const url = new URL(window.location.href);
let uid = url.searchParams.get("UID");
const UID = parseInt(uid ? uid : "");
export default Vue.extend({
  data: () => {
    return {
      details: {} as userInfoExtended,
    };
  },
  mounted() {
    console.log("Getting " + UID + "'s user data");
    window.ipcrenderer.once("get-user-details", (event, data) => {
      this.details = data;
      window.document.title = this.details.name + "'s Profile";
    });
    window.ipcrenderer.send("get-user-details", UID);
  },
});
</script>