<script lang="ts">
  import Page from '@theme/Page.svelte';
  import IconText from '@theme/IconText.svelte';
  import Dialouge from '@theme/Dialouge.svelte';
  import TTable from '@theme/TTable.svelte';
  import Info from './Info.svelte';
  import { action } from '@/coreService';
  import { slide as trns } from 'svelte/transition';
  import { Router } from '@vigneshpa/svelte-router';
  import type { Writable } from 'svelte/store';

  export let hasChildRouteComp: Writable<boolean>;

  let groups: readonly any[] = [];
  $: !$hasChildRouteComp && action('findGroups', {}).then(val => (groups = val));
  let open: number | null = null;
</script>

<template>
  <Page heading="Groups">
    <div slot="top-extra">
      <a href="groups/add" class="t-a-btn" title="Create new Group"><IconText icon="add">Add</IconText></a>
    </div>
    <TTable>
      <tr>
        <th>Year</th>
        <th>Month</th>
        <th>Batch</th>
        <th>Value</th>
      </tr>
      {#each groups as group, index}
        <tr class="fold-view" on:click={() => (open === index ? (open = null) : (open = index))}>
          <td>{group.year}</td>
          <td>{group.month}</td>
          <td>{group.batch}</td>
          <td class="rupee">{(group.totalValue / 20).toLocaleString('en-IN')}</td>
        </tr>
        {#if open === index}
          <tr class="fold">
            <td colspan="4" class="fold">
              <div class="fold" transition:trns>
                <Info {group} />
              </div>
            </td>
          </tr>
        {/if}
      {/each}
    </TTable>
  </Page>
  {#if $hasChildRouteComp}
    <Dialouge preClose={() => window['svelte-router'].router?.route('/groups')}>
      <Router />
    </Dialouge>
  {/if}
</template>

<style lang="scss">
  .rupee::before {
    content: '\20b9';
  }
</style>
