<template>
  <v-app id="1_app">
    <v-main>
      <v-container id="container">
        <v-card class="mx-auto" max-width="500">
          <v-card-title class="title font-weight-regular justify-space-between">
            <span>{{ currentTitle }}</span>
            <v-avatar color="lighten" class="headding grey--text" size="48">
              <v-icon>mdi-account-multiple-plus</v-icon>
            </v-avatar>
          </v-card-title>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card-text>
                <v-date-picker
                  label="Month"
                  type="month"
                  v-model="month"
                  required
                  id="month"
                  :loading="loading"
                  :readonly="disableInputs"
                  v-on:keyup.enter="next"
                ></v-date-picker>
                <br />
                <span
                  class="caption grey--text text--darken-1"
                >Please select year and month of the batch.</span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="2">
              <v-card-text>
                <v-text-field
                  label="Batch Name"
                  prepend-icon="mdi-batch"
                  required
                  v-model="batch"
                  v-on:keyup.enter="next"
                  id="batch"
                  :loading="loading"
                  :readonly="disableInputs"
                  :error-messages="batchMessage"
                  v-on:input="batchChange"
                ></v-text-field>
                <span
                  class="caption grey--text text--darken-1"
                >Please enter a name for this batch. This must be unique for every month.</span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="3">
              <v-card-text>
                <v-textarea
                  label="Members"
                  prepend-icon="mdi-home"
                  outlined
                  v-model="members"
                  no-resize
                  id="Members"
                  :loading="loading"
                  :readonly="disableInputs"
                  rows="4"
                ></v-textarea>
                <span class="caption grey--text text--darken-1">Please add members for this group.</span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="4">
              <v-card-text>
                <span>The details of the new Group are:</span>
                <br />
                <br />
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <v-icon>mdi-calender</v-icon>
                      </td>
                      <td>{{month}}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon>mdi-batch</v-icon>
                      </td>
                      <td>{{batch}}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon>mdi-members</v-icon>
                      </td>
                      <td>{{members}}</td>
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
              :color="submited?'primary':'success'"
              key="next"
              @click="submit"
              :disabled="submited && !success"
            >
              <v-icon v-if="!submited">mdi-content-save</v-icon>
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
    return {
      step: 1,
      month: "",
      batch: "",
      batchMessage: "",
      members: [],
      disableButtons: false as boolean,
      disableInputs: false as boolean,
      loading: false as boolean,
      submited: false as boolean,
      success: false as boolean,
      skipValidation: false as boolean,
    };
  },
  methods: {
    next() {
      document.getElementById("next")?.click();
    },
    batchChange() {
      if (!this.batch) return;
      this.batch = this.batch.charAt(0);
    },
    stepForward() {
      if (this.skipValidation) {
        this.step++;
        return;
      }
      this.disableButtons = true;
      this.disableInputs = true;
      this.validate((success) => {
        if (success) this.step++;
        this.disableInputs = false;
        this.disableButtons = false;
      });
    },
    validate(fn: (success: boolean) => void) {
      if (this.step > 3) return fn(true);
      switch (this.step) {
        case 1:
          if (!this.month) return fn(false);
          return fn(true);
          break;
        case 2:
          if (!this.batch) return fn(false);
          this.batchMessage = "";
          window.ipcrenderer.once(
            "batch-exists",
            (event, err: sqliteError, response: boolean) => {
              if (!response) {
                fn(true);
              } else {
                this.batchMessage = "Number Already exists";
                fn(false);
              }
            }
          );
          window.ipcrenderer.send("phone-exists", this.batch, this.month);
          break;
        case 3:
          if (!this.members) return fn(false);
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
        "create-group",
        (event, err: sqliteError, data: createGroupFields) => {
          if (err) {
            window.ipcrenderer.send("show-message-box", {
              message: "Some error occoured during the creation of Group",
              type: "error",
              title: "Cannot create Group!",
              detail: inspect(err),
            } as MessageBoxOptions);
            this.success = false;
          } else if (data) {
            window.ipcrenderer.send("show-message-box", {
              message: "Group created SUCCESSFULLY !",
              type: "info",
              title: "Created New Group!",
              detail: inspect(data),
            } as MessageBoxOptions);
            this.success = true;
          } else {
            window.ipcrenderer.send("show-message-box", {
              message:
                "Some error occoured during the creation of Group\nTry checking batch name.",
              type: "error",
              title: "Cannot create Group!",
              detail: "err and detail variables are undefined or not truthly",
            } as MessageBoxOptions);
            this.success = false;
          }
        }
      );
      window.ipcrenderer.send("create-group", {
        month: this.month,
        batch: this.batch,
        members: this.members,
      });
    },
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Create Group";
        case 2:
          return "Batch Name";
        case 3:
          return "Add members for " + this.batch;
        case 4:
          return "Final";
      }
    },
  },
  components: {},
  mounted() {
    window.resizeTo(550, 700);
    window.document.title = "Create Group";
  },
});
</script>
