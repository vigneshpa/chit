<template>
  <v-app id="1_app">
    <v-main>
      <v-container id="container">
        <v-card class="mx-auto" max-width="500" id="card">
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
                  :loading="loading"
                  :readonly="disableInputs"
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
                  :loading="loading"
                  :readonly="disableInputs"
                  :error-messages="phoneMessage"
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
                  :loading="loading"
                  :readonly="disableInputs"
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
            <v-btn :disabled="(step === 1) || disableButtons" text @click="step--">Back</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              id="next"
              v-if="step !==4"
              color="primary"
              @click="stepForward"
              :disabled="disableButtons"
            >Next</v-btn>
            <v-btn
              v-if="step ===4"
              :color="submited?'success':'primary'"
              key="next"
              @click="submit"
              :disabled="submited && !success"
            >
              <v-icon v-if="!submited">mdi-account-check</v-icon>
              <v-icon v-if="submited && success">mdi-checkbox-marked-circle-outline</v-icon>Finish
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { MessageBoxOptions } from "electron";
import { inspect } from "util";
import Vue from "vue";

export default Vue.extend({
  name: "create-user",
  data: () => {
    let addUserData = {
      step: 1,
      phone: "",
      phoneMessage: "",
      name: "",
      address: "",
      disableButtons: false as boolean,
      disableInputs: false as boolean,
      loading: false as boolean,
      submited: false as boolean,
      success: false as boolean,
      skipValidation: false as boolean,
    };
    return addUserData;
  },
  watch: {
    step: () => {
      window.resizeWindowToCard();
    },
  },
  methods: {
    next() {
      document.getElementById("next")!.click();
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
      setTimeout(() => {
        this.phone = ph;
      }, 0);
    },
    stepForward() {
      if (this.skipValidation) {
        this.step++;
        return;
      }
      this.disableButtons = true;
      this.disableInputs = true;
      this.loading = true;
      this.validate((success) => {
        if (success) this.step++;
        this.disableInputs = false;
        this.disableButtons = false;
        this.loading = false;
      });
    },
    validate(fn: (success: boolean) => void) {
      if (this.step > 3) return fn(true);
      switch (this.step) {
        case 1:
          if (!this.name) return fn(false);
          return fn(true);
          break;
        case 2:
          if (!this.phone) return fn(false);
          if (this.phone.startsWith("+91") && this.phone.length < 14) {
            this.phoneMessage = "Indian phone numbers must contain 10 digits";
            return fn(false);
          }
          if (this.phone.startsWith("0") && this.phone.length < 12) {
            this.phoneMessage = "Local landline numbers must contain 11 digits";
            return fn(false);
          }
          this.phoneMessage = "";
          window.ipcrenderer.once(
            "phone-exists",
            (event, err: sqliteError, response: boolean) => {
              if (!response) {
                fn(true);
              } else {
                this.phoneMessage = "Number Already exists";
                fn(false);
              }
            }
          );
          window.ipcrenderer.send("phone-exists", this.phone);
          break;
        case 3:
          if (!this.address) return fn(false);
          return fn(true);
          break;
      }
    },
    submit() {
      if (this.submited) {
        window.close();
        return;
      }
      this.submited = true;
      this.disableInputs = true;
      this.skipValidation = true;
      window.ipcrenderer.once(
        "create-user",
        (event, err: sqliteError, data: createUserFields) => {
          if (err) {
            window.ipcrenderer.send("show-message-box", {
              message: "Some error occoured during the creation of User",
              type: "error",
              title: "Cannot create User!",
              detail: inspect(err),
            } as MessageBoxOptions);
            this.success = false;
          } else if (data) {
            window.ipcrenderer.send("show-message-box", {
              message: "User created SUCCESSFULLY !",
              type: "info",
              title: "Created New User!",
              detail: inspect(data),
            } as MessageBoxOptions);
            this.success = true;
          } else {
            window.ipcrenderer.send("show-message-box", {
              message:
                "Some error occoured during the creation of User\nTry checking phone number.",
              type: "error",
              title: "Cannot create User!",
              detail: "err and detail variables are undefined",
            } as MessageBoxOptions);
            this.success = false;
          }
        }
      );
      window.ipcrenderer.send("create-user", {
        name: this.name,
        phone: this.phone,
        address: this.address,
      });
    },
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
  mounted() {
    window.document.title = "Create User";
  },
});
</script>
