<template lang="pug">
v-card#card.mx-auto(max-width="500")
  v-card-title.title.font-weight-regular.justify-space-between
    span {{ currentTitle }}
    v-avatar.headding.grey--text(color="lighten", size="48")
      v-icon mdi-account-plus
  v-window(v-model="step")
    v-window-item(:value="1")
      v-card-text
        v-text-field#name(
          label="User Name",
          prepend-icon="mdi-account",
          v-model="name",
          required,
          :loading="loading",
          :readonly="disableInputs",
          v-on:keyup.enter="next"
        )
        span.caption.grey--text.text--darken-1 This will be the name of the new user.</span>
    v-window-item(:value="2")
      v-card-text
        v-text-field#phone(
          label="Phone",
          prepend-icon="mdi-phone",
          required,
          v-model="phone",
          v-on:keyup.enter="next",
          :loading="loading",
          :readonly="disableInputs",
          :error-messages="phoneMessage",
          v-on:input="phoneChange"
        )
        span.caption.grey--text.text--darken-1 Please enter the phone number of the user. This must be unique for every user.
    v-window-item(:value="3")
      v-card-text
        v-textarea#address(
          label="Address",
          prepend-icon="mdi-home",
          outlined,
          v-model="address",
          no-resize,
          :loading="loading",
          :readonly="disableInputs",
          rows="4"
        )
        span.caption.grey--text.text--darken-1 Please enter the Address of the user.
    v-window-item(:value="4")
      v-card-text
        span The details of the new user are:
        br
        br
        table
          tbody
            tr
              td
                v-icon mdi-account
              td {{ name }}
            tr
              td
                v-icon mdi-phone
              td {{ phone }}
            tr
              td
                v-icon mdi-home
              td {{ address }}
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
      :disabled="disableButtons"
    ) Next
    v-btn(
      v-if="step === 4",
      :color="submited ? 'success' : 'primary'",
      key="next",
      @click="submit",
      :disabled="submited && !success"
    )
      v-icon(v-if="!submited") mdi-account-check
      v-icon(v-if="submited && success") mdi-checkbox-marked-circle-outline
      | Finish
</template>

<script lang="ts">
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
  },
  methods: {
    next() {
      document.getElementById("next")!.click();
    },
    phoneChange() {
      if (!this.phone) return;
      let ph: string = this.phone;
      this.phoneMessage = "";
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
    async validate(fn: (success: boolean) => void) {
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
          if (!await window.ipcirenderer.call("db-query", {query:"checkPhone", phone:this.phone})) {
                fn(true);
              } else {
                this.phoneMessage = "Number Already exists";
                fn(false);
              }
          break;
        case 3:
          if (!this.address) return fn(false);
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
      const data = window.ipcirenderer.call("db-query", {query:"createUser", 
        name: this.name,
        phone: this.phone,
        address: this.address,
      });
      if (data) {
            window.ipcirenderer.call("show-message-box", {
              message: "User created SUCCESSFULLY !",
              type: "info",
              title: "Created New User!",
              detail: data.toString(),
            } as ChitMessageBoxOptions);
            this.success = true;
          } else {
            window.ipcirenderer.call("show-message-box", {
              message:
                "Some error occoured during the creation of User\nTry checking phone number.",
              type: "error",
              title: "Cannot create User!",
              detail: "detail variable is undefined or not truthly",
            } as ChitMessageBoxOptions);
            this.success = false;
          }
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
