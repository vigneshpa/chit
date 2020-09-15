<template>
  <v-app id="1_app">
    <v-main>
      <v-container>
        <v-card class="mx-auto" max-width="500">
          <v-card-title class="title font-weight-regular justify-space-between">
            <span>{{ currentTitle }}</span>
            <v-avatar color="lighten" class="headding grey--text" size="48">
              <v-icon>mdi-account-plus</v-icon>
            </v-avatar>
          </v-card-title>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card-text>
                <v-text-field
                  label="User Name"
                  prepend-icon="mdi-account"
                  v-model="name"
                  required
                  id="name"
                  v-on:keyup.enter="next"
                ></v-text-field>
                <span
                  class="caption grey--text text--darken-1"
                >This will be the name of the new user.</span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="2">
              <v-card-text>
                <v-text-field
                  label="Phone"
                  prepend-icon="mdi-phone"
                  required
                  v-model="phone"
                  v-on:keyup.enter="next"
                  id="phone"
                  v-on:input="phoneChange"
                ></v-text-field>
                <span
                  class="caption grey--text text--darken-1"
                >Please enter the phone number of the user. This must be unique for every user.</span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="3">
              <v-card-text>
                <v-textarea
                  label="Address"
                  prepend-icon="mdi-home"
                  outlined
                  v-model="address"
                  no-resize
                  id="address"
                  rows="4"
                ></v-textarea>
                <span
                  class="caption grey--text text--darken-1"
                >Please enter the Address of the user.</span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="4">
              <v-card-text>
                <span>The details of the new user are:</span>
                <br />
                <br />
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <v-icon>mdi-account</v-icon>
                      </td>
                      <td>{{name}}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon>mdi-phone</v-icon>
                      </td>
                      <td>{{phone}}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon>mdi-home</v-icon>
                      </td>
                      <td>{{address}}</td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <span>Please check the details and click finish.</span>
              </v-card-text>
            </v-window-item>
          </v-window>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn :disabled="step === 1" text @click="step--">Back</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              id="next"
              :disabled="step === 4"
              v-if="step !==4"
              color="primary"
              @click="stepForward"
            >Next</v-btn>
            <v-btn v-if="step ===4" color="primary" key="next" @click="submit">
              <v-icon>mdi-content-save</v-icon>Finish
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "create-user",
  data: () => {
    let addUserData = {
      step: 1,
      phone: "",
      name: "",
      address: "",
    };
    return addUserData;
  },
  methods: {
    next() {
      document.getElementById("next")?.click();
    },
    phoneChange() {
      if (!this.phone) return;
      let ph: string = this.phone;
      if (!(ph.startsWith("+") || ph.startsWith("0"))) {
        ph = "+91" + ph;
      }
      ph = (ph.startsWith("+") ? "+" : "") + ph.replace(/[^0-9]/g, "").trim();
      if (ph.startsWith("+91") && ph.length > 3) {
        ph = "+91 " + ph.slice(3, 13);
      }
      if (ph.startsWith("0") && ph.length > 5) {
        ph = ph.slice(0, 5) + "-" + ph.slice(5, 11);
      }
      setTimeout(()=>{
          this.phone = ph;
        },
        0
      );
    },
    stepForward(){
      this.validate(()=>{
      this.step++;
      });
    },
    validate(fn:()=>void){
      if(this.step>3)return fn();
      switch (this.step){
        case 1:
          if(!this.name)return false;
          break;
        case 2:
          window.ipcrenderer.send()
          if(!this.phone)return false;
          break;
        case 3:
          if(!this.address)return false;
          break;
      }
      return fn();
    },
    submit(){
      window.ipcrenderer.once("create-user-account", function(event, data:createUser){});
      window.ipcrenderer.send("create-user-account", {
        name:this.name,
        phone:this.phone,
        address:this.address
      });
    }
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Add User";
        case 2:
          return "Phone Number of " + this.name;
        case 3:
          return "Address of " + this.name;
        case 4:
          return "Final";
      }
    },
  },
  components: {},
  mounted() {},
});
</script>
