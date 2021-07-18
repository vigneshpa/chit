<template>
  <svelte:component this={pageComp}/>
  {#if isLoading}
    <Loading info={pageStr}/>
  {/if}
</template>
<script lang="ts">
  import navaid from 'navaid';
  let router = navaid();
  import {Loading} from '@theme/';
  let pageStr = '';
  let params:any = {};
  let pageComp = Loading;
  let isLoading = true;
  const lp = (ldr:()=>Promise<any>)=>(
    async (parms:any)=>{
      params = parms;

      isLoading = true;
      pageComp = (await ldr()).default;
      isLoading = false;
    }
  );
  router
  .on('/',          lp(()=>import('./Dashboard.svelte')))
  .on('/users',     lp(()=>import('./Users.svelte')))
  .on('/users/:id', lp(()=>import('./UsersInfo.svelte')))
  .on('/about',     lp(()=>import('./About.svelte')))
  .listen();
</script>