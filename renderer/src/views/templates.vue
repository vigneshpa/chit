<template lang="pug">
v-container(fluid)
  v-dialog(v-model="groupDetails.visible" max-width="800")
    group-details(v-if="groupDetails.visible" :uuid="groupDetails.uuid")
  v-overlay(v-if="loading" absolute)
    v-progress-circular(indeterminate style="padding:20px;margin:20px;")
  v-data-iterator(
    :items="groups",
    :search="search",
    :sort-by="keys[sortBy]",
    :sort-desc="sortDesc"
    v-if="!loading"
  )
    template(v-slot:header)
      v-toolbar.mb-1(dark, color="blue darken-3")
        v-text-field(
          v-model="search",
          clearable,
          flat,
          solo-inverted,
          hide-details,
          prepend-inner-icon="mdi-magnify",
          label="Search"
        )
        template(v-if="$vuetify.breakpoint.mdAndUp")
          v-spacer
          v-select(
            v-model="sortBy",
            flat,
            solo-inverted,
            hide-details,
            :items="sortByKeys",
            prepend-inner-icon="mdi-sort",
            label="Sort by"
          )
          v-spacer
          v-btn-toggle(v-model="sortDesc", mandatory)
            v-btn(large, depressed, color="blue", :value="false")
              v-icon mdi-arrow-up
            v-btn(large, depressed, color="blue", :value="true")
              v-icon mdi-arrow-down
    template(v-slot:default="props")
      v-row
        v-col(
          v-for="item in props.items",
          :key="item.uuid",
          cols="12",
          sm="6",
          md="4",
          lg="3"
        )
          v-card
            v-card-title.subheading.font-weight-bold
              span {{ item.name }}
              v-spacer
              v-btn(text @click="groupDetails.uuid = item.uuid; groupDetails.visible=true")
                v-icon mdi-newspaper
            v-divider
            v-list(dense)
              v-list-item(
                v-for="(key, index) in filteredKeys",
                :key="index"
                )
                v-list-item-content(
                  :class="{ 'blue--text': sortBy === key }"
                  ) {{ key }}:
                v-list-item-content.align-end(
                  :class="{'blue--text': sortBy === key }"
                  ) {{ formatter.hasOwnProperty(keys[key])?formatter[keys[key]](item[keys[key]]):item[keys[key]] }}
</template>
<script lang="ts">
import Vue from "vue";
import moment from "moment";
moment.locale("en-in");
export default Vue.extend({
  data() {
    return {
      groups: [] as GroupTD[],
      loading: false as boolean,
      itemsPerPageArray: [4, 8, 12] as number[],
      search: "" as string,
      filter: {},
      sortDesc: false as boolean,
      page: 1 as number,
      itemsPerPage: 4 as number,
      sortBy: "Name" as string,
      sortByKeys: ["Name", "Batch", "Month", "Year", "Created At"] as string[],
      keys: {
        Name: "name",
        Batch: "batch",
        Month: "month",
        Year: "year",
        "Created At": "createdAt",
      } as { [key: string]: string },
      formatter: {
        createdAt(date) {
          return moment(date).calendar();
        },
        updatedAt(date) {
          return moment(date).calendar();
        },
        month(month) {
          return moment()
            .month(month)
            .format("MMMM");
        },
      } as { [key in keyof GroupD]: (value: GroupD[key]) => string },
      items: [],
      groupDetails: {
        visible: false as boolean,
        uuid: "" as string,
      },
    };
  },
  components: {
    "group-details": () => import("@/components/GroupDetails.vue"),
  },
  computed: {
    numberOfPages(): number {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys(): string[] {
      return this.sortByKeys.filter((key: string) => key !== "Name");
    },
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number: number) {
      this.itemsPerPage = number;
    },
  },
  async mounted() {
    this.loading = true;
    this.groups = <GroupTD[]>(
      await window.ipcirenderer.callMethod("dbQuery", { query: "listGroupTemplates" })
    );
    this.loading = false;
  },
});
</script>
