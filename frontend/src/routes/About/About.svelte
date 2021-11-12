<script lang="ts">
  import Dialouge from '@theme/Dialouge.svelte';
  import Page from '@theme/Page.svelte';
  import Router from '@vigneshpa/svelte-router/Router.svelte';
  import type { Writable } from 'svelte/store';
  import Technologies from './Technologies.svelte';
  export let hasChildRouteComp: Writable<boolean>;
</script>

<template>
  <Page heading="About">
    <div class="heading">Technologies used</div>
    <Technologies />
    <div class="heading">License</div>
    <div class="license">
      Chit Management System (ChitAPP) - Reports for chit crowd funding<br />
      Copyright © 2021 Vignesh<br />
      <p>
        This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the
        Free Software Foundation, either version 3 of the License, or (at your option) any later version.
      </p>
      <p>
        This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
        or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
      </p>
      <p>
        You should have received a copy of the GNU General Public License along with this program. If not, see <a href="/about/license/">here</a>.
      </p>
      <button class="t-btn" on:click={() => window['svelte-router'].router?.route('/about/license')}>View Full Version</button>
    </div>
  </Page>

  {#if $hasChildRouteComp}
    <Dialouge preClose={() => window['svelte-router'].router?.route('/groups')}>
      <Router />
    </Dialouge>
  {/if}
</template>

<style>
  .heading {
    font-size: 2rem;
    padding: 1rem;
    text-decoration: underline;
    text-align: center;
    margin-top: 3rem;
  }
  .license {
    max-width: 50rem;
    margin: 1rem auto;
    line-height: 1.5rem;
  }
</style>
