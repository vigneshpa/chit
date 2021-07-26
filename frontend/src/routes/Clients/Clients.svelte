<script lang="ts">
  import { action } from '@/api';
  import { Page } from '@theme/';
  import { slide as trns } from 'svelte/transition';
  import { Grid } from '@theme/';
  import { IconText } from '@theme/';
  import { Router } from '@/router/';
  import { Dialouge } from '@theme/';
  import type { Writable } from 'svelte/store';

  export let hasChildRouteComp: Writable<boolean>;

  let clients: any[] = [];
  $: !$hasChildRouteComp && action('findClients').then(val => (clients = val));
</script>

<template>
  <Page heading="Clients">
    <div slot="top-extra">
      <a href="clients/add" class="t-a-btn" title="Create new Client"><IconText icon="add">Add</IconText></a>
    </div>
    <Grid>
      {#each clients as client}
        <div class="client" transition:trns>
          <div class="name"><IconText icon="person">{client.name}</IconText></div>
          <div class="details">
            <div class="phone">{client.phone}</div>
            <div class="address">
              {#each client.address.split('\n') as level}
                {level}<br />
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </Grid>
  </Page>
  {#if $hasChildRouteComp}
    <Dialouge preClose={() => window['svelte-router'].router?.route('/clients')}>
      <Router />
    </Dialouge>
  {/if}
</template>

<style lang="scss">
  .client {
    padding: 10px;
    margin: 10px;
    text-align: center;
    .name {
      font-size: 1.2em;
      padding: 5px;
      margin: 5px;
      font-weight: 600;
      border-bottom: solid 1px black;
    }
    div {
      padding: 5px;
      margin-top: 5px;
    }
  }
</style>
