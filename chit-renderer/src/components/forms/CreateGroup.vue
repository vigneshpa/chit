<template lang="pug">
v-card.mx-auto(max-width="500")
  v-card-title.title.font-weight-regular.justify-space-between
    span {{ currentTitle }}
    v-avatar.headding.grey--text(color="lighten", size="48")
      v-icon mdi-account-multiple-plus
  v-window(v-model="step" touchless)
    v-window-item(:value="1")
      v-card-text
        v-date-picker#month(
          label="Month",
          type="month",
          v-model="monthModel",
          required,
          :loading="loading",
          :readonly="disableInputs",
          v-on:keyup.enter="next",
          full-width,
          color="primary"
        )
        br
        span.caption.grey--text.text--darken-1 Please select year and month of the batch.
    v-window-item(:value="2")
      v-card-text
        v-text-field#batch(
          label="Batch Name",
          prepend-icon="mdi-alphabetical-variant",
          required,
          v-model="batch",
          v-on:keyup.enter="next",
          :loading="loading",
          :readonly="disableInputs",
          :error-messages="batchMessage",
          @input="batchChange"
        )
        span.caption.grey--text.text--darken-1 Please enter a name for this batch in month of {{ this.formatedMonth }}. This must be unique for every batch within a month.
    v-window-item(:value="3")
      v-card-text
        v-card(:loading="loading")
          v-card-text
            v-autocomplete(
              v-model="memberModel",
              :items="users",
              :loading="loading",
              hide-no-data,
              hide-selected,
              item-text="name",
              item-value="UID",
              label="Member",
              prepend-icon="mdi-account",
              :readonly="disableInputs",
              return-object,
              append-outer-icon="mdi-reload",
              @click:append-outer="reloadUsers"
            )
            v-text-field(
              prepend-icon="mdi-number",
              v-model="noOfChits",
              label="Number of Chits",
              type="number",
              :max="20 - totalChits",
              min="0",
              :readonly="disableInputs",
              @keyup.enter="window.document.getElementById('add').click()"
            )
          v-divider
          v-expand-transition
            v-list(
              v-if="memberModel",
              width="312",
              style="position: absolute; z-index: 1",
              elevation="5"
            )
              v-list-item(
                v-for="(field, key) in memberModel",
                :key="key + 'userDetail'"
              )
                v-list-item-content
                  v-list-item-title(v-text="field")
                  v-list-item-subtitle(v-text="key")
              v-list-item
                v-btn(
                  :disabled="!memberModel",
                  @click="memberModel = null"
                )
                  v-icon mdi-close
          v-card-actions
            v-spacer
            v-btn#add(
              :disabled="!memberModel || !noOfChits || !(parseFloat(noOfChits) > 0) || parseFloat(noOfChits) > 20 - totalChits",
              @click="addMember",
              color="primary"
            )
              | Add
              v-icon mdi-plus
        div(style="height: 304px; overflow: auto")
          v-subheader Members of the new group:
          v-list
            v-fab-transition(group)
              v-list-item(
                v-for="member in members",
                :key="member.info.UID + 'memberDetail'",
                @click="empty"
              )
                v-list-item-content(:title="member.info.phone + '\\n' + member.info.address") {{ member.info.name }}
                v-chip(v-text="member.noOfChits")
                v-list-item-action(
                  @click="removeMember(member)",
                  v-if="!disableInputs"
                )
                  v-icon mdi-close-circle
        span.caption.grey--text.text--darken-1
          | Please add members for this group. Total no of chits must be 20.
          br
          | {{ totalChits }} alloted {{ 20 - totalChits }} remaining.
      v-progress-linear(:value="totalChits * 5")
    v-window-item(:value="4")
      v-card-text
        span The details of the new Group are:
        br
        br
        v-list
          v-subheader Month
          v-list-item
            v-list-item-icon
              v-icon mdi-calendar
            v-list-item-title {{ formatedMonth }}
          v-subheader Batch Name
          v-list-item
            v-list-item-icon
              v-icon mdi-alphabetical-variant
            v-list-item-title {{ batch }}
          v-subheader Members
          v-list-group(prepend-icon="mdi-account-group", no-action)
            template(v-slot:activator)
              v-list-item-content
                v-list-item-title {{ members.length }} Members
            v-list-item(
              v-for="member in members",
              :key="member.info.UID + 'memberFinal'",
              @click="empty"
            )
              v-list-item-content(v-text="member.info.name" :title="member.info.phone + '\\n' + member.info.address")
              v-chip(v-text="member.noOfChits")
        br
        span Please check the details and click finish.
  v-divider
  v-card-actions
    v-btn(
      :disabled="step === 1 || disableButtons",
      text,
      @click="step--"
    ) Back
    v-spacer
    v-btn#next(
      v-if="step !== 4",
      color="primary",
      @click="stepForward",
      :disabled="disableButtons || (step === 3 && totalChits !== 20)"
    ) Next
    v-btn(
      v-if="step === 4",
      :color="submited ? 'success' : 'primary'",
      key="next",
      @click="submit",
      :disabled="submited && !success"
    )
      v-icon(v-if="!submited") mdi-account-multiple-check
      v-icon(v-if="submited && success") mdi-checkbox-marked-circle-outline
      | Finish
</template>

<script lang="ts">
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
      memberModel: null as UserD | null,
      noOfChits: null as string | null,
      users: [] as UserD[],
      loadedUsers: false as boolean,
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
        total += member.noOfChits;
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
    step: function() {
      if (this.step === 3) this.getUsers();
    },
  },
  methods: {
    empty() {},
    removeMember(member: members) {
      this.users.push(member.info);
      this.members.splice(this.members.indexOf(member), 1);
    },
    addMember() {
      if (this.memberModel && this.noOfChits) {
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
          noOfChits: parseFloat(this.noOfChits),
        });
        this.memberModel = null;
        this.noOfChits = null;
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
      if (this.loadedUsers) return;
      this.loading = true;
      this.disableInputs = true;
      window.ipcrenderer.once("db-query-listUsers", (event, ret) => {
        this.users = ret;
        console.log(ret);
        this.disableInputs = false;
        this.loading = false;
        this.loadedUsers = true;
      });
      window.ipcrenderer.send("db-query", { query: "listUsers" });
    },
    reloadUsers() {
      this.loading = true;
      this.disableInputs = true;
      window.ipcrenderer.once("db-query-listUsers", (event, data) => {
        console.log(data);
        this.members.forEach((member) => {
          this.users.splice(this.users.indexOf(member.info), 1);
        });
        this.disableInputs = false;
        this.loading = false;
      });
      window.ipcrenderer.send("db-query", { query: "listUsers" });
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
          window.ipcrenderer.once("db-query-checkBatch", (event, response) => {
            if (!response) {
              fn(true);
            } else {
              this.batchMessage = "Batch Already exists";
              fn(false);
            }
          });
          window.ipcrenderer.send("db-query", {
            query: "checkBatch",
            batch: this.batch,
            month: this.month,
            year: this.year,
          });
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
        return;
      }
      this.submited = true;
      this.disableInputs = true;
      this.skipValidation = true;
      const finalMembers: GroupD["members"] = [];
      this.members.forEach((member) => {
        finalMembers.push({
          uuid: member.info.uuid,
          noOfChits: member.noOfChits,
        });
      });
      window.ipcrenderer.once("db-query-createGroup", (event, data) => {
        if (data) {
          window.ipcrenderer.send("show-message-box", {
            message: "Group created SUCCESSFULLY !",
            type: "info",
            title: "Created New Group!",
            detail: data.toString(),
          } as ChitMessageBoxOptions);
          this.success = true;
        } else {
          window.ipcrenderer.send("show-message-box", {
            message:
              "Some error occoured during the creation of Group\nTry checking batch name.",
            type: "error",
            title: "Cannot create Group!",
            detail: "detail variable is undefined or not truthly",
          } as ChitMessageBoxOptions);
          this.success = false;
        }
      });
      window.ipcrenderer.send("db-query", {
        query: "createGroup",
        month: this.month,
        batch: this.batch,
        year: this.year,
        members: finalMembers,
      });
    },
  },
  components: {},
  mounted() {
    window.document.title = "Create Group";
  },
});

interface members {
  info: UserD;
  noOfChits: number;
}
</script>
