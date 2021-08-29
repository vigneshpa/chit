<script lang="ts">
  import Container from '@theme/Container.svelte';
  import Drawer from '@theme/Drawer.svelte';
  import IconText from '@theme/IconText.svelte';
  import Nav from '@theme/Nav.svelte';
  import TApp from '@theme/TApp.svelte';
  import { Router } from '@vigneshpa/svelte-router';
  import routes from '@/routes/';
  import Prompt from '@theme/Prompt.svelte';
  const bURL = window.bURL;
  let route_loading = window['svelte-router'].isLoading;
  let drawer_links = [
    { href: bURL + '/dashboard', text: 'Dashboard', icon: 'space_dashboard', icon_noutlined: false },
    { href: bURL + '/clients', text: 'Clients', icon: 'people' },
    { href: bURL + '/groups', text: 'Groups', icon: 'groups' },
    { href: bURL + '/backup', text: 'Backup', icon: 'settings_backup_restore' },
    { href: bURL + '/about', text: 'About', icon: 'info' },
  ];
  let route_pageStr = window['svelte-router'].pageStr;
  const serviceWorkerStatus = window.serviceWorkerStatus;
  let installEvent: Event | null = null;
  const install = () => {
    (installEvent as any).prompt();
    installEvent = null;
  };
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    installEvent = e;
  });
  let prompt = true;
</script>

<template>
  <TApp>
    <Container>
      <Router base={bURL} {...routes} />
    </Container>

    <Drawer>
      {#each drawer_links as lnk}
        <a href={lnk.href} class:linkactive={(bURL + $route_pageStr).startsWith(lnk.href)}>
          <IconText icon={lnk.icon} outlined={!lnk.icon_noutlined}>{lnk.text}</IconText>
        </a>
      {/each}
    </Drawer>

    <Nav loading={$route_loading}>
      <span class="title"> Chit Management System</span>
      {#if !window.useLocalCore}
        <a href="/api/logout"> Logout </a>
      {:else if serviceWorkerStatus}
        {#if $serviceWorkerStatus === 'preparing'}
          <span class="material-icons" title="Downloading service worker.">downloading</span>
        {:else if $serviceWorkerStatus === 'downloading'}
          <div class="lds-ripple" title="A new version of app is being downloaded by the service worker.">
            <div />
            <div />
          </div>
        {:else if $serviceWorkerStatus === 'ready'}
          <span class="material-icons" title="Service worker is ready and the app is available offline">offline_pin</span>
        {:else if $serviceWorkerStatus === 'refresh'}
          <span class="material-icons" title="A new version of the app is downloaded and requires restart">restart_alt</span>
        {:else if $serviceWorkerStatus === 'offline'}
          <span class="material-icons" title="No internet connection">wifi_off</span>
        {/if}
      {/if}
    </Nav>

    <Prompt show={!!installEvent}>
      <div>
        <p>Chit App can now work offline.<br />Do you want to install?</p>
      </div>
      <svelte:fragment slot="buttons">
        <button class="t-btn secondary" on:click={() => (installEvent = null)}>Cancel</button>
        <button class="t-btn" on:click={install}>Install</button>
      </svelte:fragment>
    </Prompt>
  </TApp>
</template>

<style>
  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 48px;
    height: 48px;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 20px;
      left: 20px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 40px;
      height: 40px;
      opacity: 0;
    }
  }
</style>
