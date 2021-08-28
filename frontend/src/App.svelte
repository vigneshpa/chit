<script lang="ts">
  import Container from '@theme/Container.svelte';
  import Drawer from '@theme/Drawer.svelte';
  import IconText from '@theme/IconText.svelte';
  import Nav from '@theme/Nav.svelte';
  import TApp from '@theme/TApp.svelte';
  import { Router } from '@vigneshpa/svelte-router';
  import routes from '@/routes/';
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
      <span> Chit Management System</span>
      {#if !window.useLocalCore}
        <a href="/api/logout"> Logout </a>
      {/if}
    </Nav>
  </TApp>
</template>
