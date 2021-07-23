<script lang="ts">
  import { action } from '@/api';
  import { Page } from '@theme/';
  import { slide as trns } from 'svelte/transition';
  import { Grid } from '@theme/';
  import { IconText } from '@theme/';
  import Router from '@/router/Router.svelte';

  let users: any[] = [];
  action('findUsers', {}) // Getting all users
    .then(val => (users = val));
</script>

<template>
  <Page heading="Users">
    <div slot="top-extra">
      <a href="users/add" class="t-a-btn" title="Create new User"><IconText icon="add">Add</IconText></a>
    </div>
    <Grid>
      {#each users as user}
        <div class="user" transition:trns>
          <div class="name"><IconText icon="person">{user.name}</IconText></div>
          <div class="details">
            <div class="phone">{user.phone}</div>
            <div class="address">{user.address}</div>
          </div>
        </div>
      {/each}
    </Grid>
    <Router />
  </Page>
</template>

<style lang="scss">
  .user {
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
