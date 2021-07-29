<script lang="ts">
  import { action } from '@/api';
  import { Page } from '@theme/';
  import { slide as trns } from 'svelte/transition';
  import { IconText } from '@theme/';
  import { Router } from '@/router/';
  import { Dialouge } from '@theme/';
  import type { Writable } from 'svelte/store';

  export let hasChildRouteComp: Writable<boolean>;

  let groups: any[] = [];
  $: !$hasChildRouteComp && action('findGroups').then(val => (groups = val));
</script>

<template>
  <Page heading="Groups">
    <div slot="top-extra">
      <a href="groups/add" class="t-a-btn" title="Create new Group"><IconText icon="add">Add</IconText></a>
    </div>
    <div class="groups">
      {#each groups as group}
        <div class="group" transition:trns>
          <div class="tbl">
            <div>{group.name}</div>
            <div>{group.batch}</div>
            <div>{group.month}</div>
            <div>{group.year}</div>
          </div>
        </div>
      {/each}
    </div>
  </Page>
  {#if $hasChildRouteComp}
    <Dialouge preClose={() => window['svelte-router'].router?.route('/groups')}>
      <Router />
    </Dialouge>
  {/if}
</template>

<style lang="scss">
  .group {
    padding: 5px;
    margin: 0px;
    text-align: center;
    .tbl > div {
      display: inline-block;
      margin:5px;
      padding:5px;
    }
  }
</style>
