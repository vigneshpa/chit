<template>
  <v-app id="1_app">
    <v-main>
      <v-container>
        <v-card class="mx-auto" max-width="500">
          <v-card-title class="title font-weight-regular justify-space-between">
            <span>{{ currentTitle }}</span>
            <v-avatar
              color="lighten"
              class="headding grey--text"
              size="48"
            ><v-icon>mdi-account-plus</v-icon></v-avatar>
          </v-card-title>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card-text>
                <v-text-field
                  label="User Name"
                  v-model="details.name"
                ></v-text-field>
                <span class="caption grey--text text--darken-1">
                  This is the name of the new user.
                </span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="2">
              <v-card-text>
                <v-text-field
                  label="Phone"
                  type="tel"
                  v-model="details.phone"
                ></v-text-field>
                <span  class="caption grey--text text--darken-1">
                  Please enter the phone number of the user. This must be unique for every user.
                </span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="3">
              <v-card-text>
                <v-text-field
                  label="Address"
                  type="textarea"
                  v-model="details.address"
                ></v-text-field>
                <span class="caption grey--text text--darken-1">
                  Please enter the Address of the user.
                </span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="4">
              <v-card-text>
                <span>
                  The details of the new user are:<br/>
                  Name:{{details.name}}<br/>
                  Phone:{{details.phone}}<br/>
                  Address:{{details.address}}<br/>
                </span>
                <span>
                  Please check the details and click finish.
                </span>
              </v-card-text>
            </v-window-item>
          </v-window>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              :disabled="step === 1"
              text
              @click="step--"
            >
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              id="next"
             :disabled="step === 4"
             v-if="step !==4"
             color="primary"
             @click="step++"
            >
              Next
            </v-btn>
            <v-btn
              v-if="step ===4"
              color="primary"
              key="next"
            >
              Finish
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'create-group',
  data:()=>{return {
    step:1,
    details:{}
  }},
  computed:{
    currentTitle(){
      switch(this.step){
        case 1: return "Add Group"
        case 2: return "Add Someone"
        case 3: return "Add Address"
        case 4: return "Final"
      }
    }
  },
  components: {
  }
});
</script>