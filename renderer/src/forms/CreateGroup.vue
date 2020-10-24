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
                  v-model="monthModel"
                  required
                  id="month"
                  :loading="loading"
                  :readonly="disableInputs"
                  v-on:keyup.enter="next"
                  full-width
                  color="primary"
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
                  prepend-icon="mdi-alphabetical-variant"
                  required
                  v-model="batch"
                  v-on:keyup.enter="next"
                  id="batch"
                  :loading="loading"
                  :readonly="disableInputs"
                  :error-messages="batchMessage"
                  @input="batchChange"
                ></v-text-field>
                <span
                  class="caption grey--text text--darken-1"
                >Please enter a name for this batch in month of {{this.formatedMonth}}. This must be unique for every batch within a month.</span>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="3">
              <v-card-text>
                <v-card :loading="loading">
                  <v-card-text>
                    <v-autocomplete
                      v-model="memberModel"
                      :items="users"
                      :loading="loading"
                      hide-no-data
                      hide-selected
                      item-text="name"
                      item-value="UID"
                      label="Member"
                      prepend-icon="mdi-account"
                      :readonly="disableInputs"
                      return-object
                      append-outer-icon="mdi-reload"
                      @click:append-outer="reloadUsers"
                    ></v-autocomplete>
                    <v-text-field
                      prepend-icon="mdi-number"
                      v-model="no_of_chits"
                      label="Number of Chits"
                      type="number"
                      :max="20-totalChits"
                      min="0"
                      :readonly="disableInputs"
                      @keyup.enter="window.document.getElementById('add').click()"
                    ></v-text-field>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-expand-transition>
                    <v-list
                      v-if="memberModel"
                      width="312"
                      style="position:absolute;z-index:1"
                      elevation="5"
                    >
                      <v-list-item v-for="(field, key) in memberModel" :key="key+'userDetail'">
                        <v-list-item-content>
                          <v-list-item-title v-text="field"></v-list-item-title>
                          <v-list-item-subtitle v-text="key"></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-btn :disabled="!memberModel" @click="memberModel = null">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-expand-transition>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      :disabled="!memberModel || !no_of_chits || !(parseFloat(no_of_chits)>0) || (parseFloat(no_of_chits)>(20-totalChits))"
                      @click="addMember"
                      color="primary"
                      id="add"
                    >
                      Add
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
                <div style="height:304px;overflow:auto">
                  <v-subheader>Members of the new group:</v-subheader>
                  <v-list>
                    <v-fab-transition group>
                      <v-list-item
                        v-for="member in members"
                        :key="member.info.UID+'memberDetail'"
                        @click="empty"
                      >
                        <v-list-item-content
                          :title="member.info.phone + '\n' + member.info.address"
                        >{{member.info.name}}</v-list-item-content>
                        <v-chip v-text="member.no_of_chits"></v-chip>
                        <v-list-item-action @click="removeMember(member)" v-if="!disableInputs">
                          <v-icon>mdi-close-circle</v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </v-fab-transition>
                  </v-list>
                </div>
                <!-- <v-textarea
                  label="Members"
                  prepend-icon="mdi-home"
                  outlined
                  v-model="members"
                  no-resize
                  id="Members"
                  :loading="loading"
                  :readonly="disableInputs"
                  rows="4"
                ></v-textarea>-->
                <span class="caption grey--text text--darken-1">
                  Please add members for this group. Total no of chits must be 20.
                  <br />
                  {{totalChits}} alloted {{20-totalChits}} remaining.
                </span>
              </v-card-text>
              <v-progress-linear :value="totalChits*5"></v-progress-linear>
            </v-window-item>
            <v-window-item :value="4">
              <v-card-text>
                <span>The details of the new Group are:</span>
                <br />
                <br />

                <v-list>
                  <v-subheader>Month</v-subheader>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-calendar</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{formatedMonth}}</v-list-item-title>
                  </v-list-item>
                  <v-subheader>Batch Name</v-subheader>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-alphabetical-variant</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{batch}}</v-list-item-title>
                  </v-list-item>
                  <v-subheader>Members</v-subheader>
                  <v-list-group prepend-icon="mdi-account-group" no-action>
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title>{{members.length}} Members</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-item v-for="member in members" :key="member.info.UID+'memberFinal'" @click="empty">
                      <v-list-item-content
                        v-text="member.info.name"
                        :title="member.info.phone+'\n'+member.info.address"
                      ></v-list-item-content>
                      <v-chip v-text="member.no_of_chits"></v-chip>
                    </v-list-item>
                  </v-list-group>
                </v-list>
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
              :disabled="disableButtons || (step === 3 && totalChits !== 20)"
            >Next</v-btn>
            <v-btn
              v-if="step ===4"
              :color="submited?'success':'primary'"
              key="next"
              @click="submit"
              :disabled="submited && !success"
            >
              <v-icon v-if="!submited">mdi-account-multiple-check</v-icon>
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
      monthModel: "",
      batch: "",
      batchMessage: "",
      members: [] as members[],
      memberModel: null as userInfo | null,
      no_of_chits: null as string | null,
      users: [] as userInfo[],
      loadedUsers:false as boolean,
      disableButtons: false as boolean,
      disableInputs: false as boolean,
      loading: false as boolean,
      submited: false as boolean,
      success: false as boolean,
      skipValidation: false as boolean,
      window: window,
    };
  },
  computed: {
    totalChits() {
      let total = 0;
      this.members.forEach((member) => {
        total += member.no_of_chits;
      });
      return total;
    },
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Create Group";
        case 2:
          return "Batch Name";
        case 3:
          return "Add members for " + this.batch + " batch";
        case 4:
          return "Final";
      }
    },
    month(): number {
      return parseInt(this.monthModel.split("-")[1]);
    },
    year(): number {
      return parseInt(this.monthModel.split("-")[0]);
    },
    formatedMonth(): string {
      const date = new Date(this.monthModel);
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return month[date.getMonth()] + ", " + date.getFullYear();
    },
  },
  watch: {
    step: function () {
      window.resizeWindowToCard();
      if (this.step === 3) this.getUsers();
    },
  },
  methods: {
    empty(){},
    removeMember(member: members) {
      this.users.push(member.info);
      this.members.splice(this.members.indexOf(member), 1);
    },
    addMember() {
      if (this.memberModel && this.no_of_chits) {
        let removed = this.users.splice(
          this.users.indexOf(this.memberModel),
          1
        );
        if (removed.length !== 1) {
          this.users.push(...removed);
          return;
        }
        this.members.push({
          info: removed[0],
          no_of_chits: parseFloat(this.no_of_chits),
        });
        this.memberModel = null;
        this.no_of_chits = null;
      }
    },
    next() {
      document.getElementById("next")!.click();
    },
    batchChange() {
      if (!this.batch) return;
      let bch = this.batch;
      bch = bch.toUpperCase().replace(/[^A-Z]/g, "");
      bch = bch.charAt(bch.length - 1);
      this.batchMessage = "";
      setTimeout(() => {
        this.batch = bch;
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
    getUsers() {
      if(this.loadedUsers)return;
      this.loading = true;
      this.disableInputs = true;
      window.ipcrenderer.once(
        "get-users-data",
        (event, data: userInfo[]) => {
          this.users = data;
          console.log(data);
          this.disableInputs = false;
          this.loading = false;
          this.loadedUsers = true;
        }
      );
      window.ipcrenderer.send("get-users-data");
    },
    reloadUsers() {
      this.loading = true;
      this.disableInputs = true;
      window.ipcrenderer.once(
        "get-users-data",
        (event, data: createUserFields[]) => {
          console.log(data);
          this.members.forEach((member) => {
            this.users.splice(this.users.indexOf(member.info), 1);
          });
          this.disableInputs = false;
          this.loading = false;
        }
      );
      window.ipcrenderer.send("get-users-data");
    },
    validate(fn: (success: boolean) => void) {
      if (this.step > 3) return fn(true);
      switch (this.step) {
        case 1:
          if (!this.monthModel) return fn(false);
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
                this.batchMessage = "Batch Already exists";
                fn(false);
              }
            }
          );
          window.ipcrenderer.send(
            "batch-exists",
            this.batch,
            this.month,
            this.year
          );
          break;
        case 3:
          if (!this.members) return fn(false);
          if (this.totalChits !== 20) return fn(false);
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
      const finalMembers:createGroupFields["members"] = [];
      this.members.forEach(member => {
        finalMembers.push({UID:member.info.UID, no_of_chits:member.no_of_chits});
      });
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
        year: this.year,
        members: finalMembers,
      } as createGroupFields);
    },
  },
  components: {},
  mounted() {
    window.resizeTo(550, 700);
    window.document.title = "Create Group";
  },
});

interface members {
  info: userInfo;
  no_of_chits: number;
}
</script>
