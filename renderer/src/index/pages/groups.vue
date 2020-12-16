<template>
  <v-container fluid>
    <v-data-iterator
      :items="groups"
      :search="search"
      :sort-by="keys[sortBy]"
      :sort-desc="sortDesc"
    >
      <template v-slot:header>
        <v-toolbar dark color="blue darken-3" class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keysNames"
              prepend-inner-icon="mdi-sort"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed color="blue" :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed color="blue" :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>
      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-hover
              ><template v-slot:default="{ hover }">
                <v-card>
                  <v-card-title class="subheading font-weight-bold">
                    <span>{{ item.name }}</span
                    ><v-spacer /><v-icon>mdi-account-details</v-icon>
                  </v-card-title>

                  <v-divider></v-divider>

                  <v-list dense>
                    <v-list-item
                      v-for="(key, index) in filteredKeys"
                      :key="index"
                    >
                      <v-list-item-content
                        :class="{ 'blue--text': sortBy === key }"
                      >
                        {{ key }}:
                      </v-list-item-content>
                      <v-list-item-content
                        class="align-end"
                        :class="{ 'blue--text': sortBy === key }"
                      >
                        {{ item[keys[key]] }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-expand-transition>
                    <v-overlay v-if="hover" absolute color="grey">
                      <v-btn @click="editGroup(item.UID)">View profile</v-btn>
                    </v-overlay>
                  </v-expand-transition>
                </v-card>
              </template>
            </v-hover>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      groups: [] as GroupInfo[],
      loading: false as boolean,
      itemsPerPageArray: [4, 8, 12] as number[],
      search: "" as string,
      filter: {},
      sortDesc: false as boolean,
      page: 1 as number,
      itemsPerPage: 4 as number,
      sortBy: "GID" as string,
      keysNames: ["Name", "GID", "Month", "Year", "Batch"] as string[],
      keys: {
        Name: "name",
        GID: "GID",
        Month: "month",
        Year: "year",
        Batch: "batch"
      } as { [key: string]: string },
      items: [],
    };
  },
  computed: {
    numberOfPages(): number {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys(): string[] {
      return this.keysNames.filter((key: string) => key !== "GID");
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
    editGroup(GID: number) {},
  },
  mounted() {
    window.ipcrenderer.once("get-groups-data", (event, data: GroupInfo[]) => {
      this.groups = data;
      this.loading = false;
    });
    this.loading = true;
    window.ipcrenderer.send("get-groups-data");
  },
});
</script>