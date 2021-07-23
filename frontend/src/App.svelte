<script lang="ts">
  import { Container, Drawer, IconText, Nav } from '@theme/';
  import { Router } from '@/router';
  import routes from '@/routes/';
  const bURL = window.bURL;
  let route_loading = window['svelte-router'].isLoading;
  let drawer_links = [
    { href: bURL + '/dashboard', text: 'Dashboard', icon: 'space_dashboard', icon_noutlined: false },
    { href: bURL + '/users', text: 'Users', icon: 'people' },
    { href: bURL + '/groups', text: 'Groups', icon: 'groups' },
    { href: bURL + '/about', text: 'About', icon: 'info' },
  ];
  let route_pageStr: string = '';
  window['svelte-router'].pageStr.subscribe(val => (route_pageStr = val));
</script>

<template>
  <div id="app">
    <Container>
      <Router base={bURL} {...routes} />
    </Container>

    <Drawer>
      {#each drawer_links as lnk}
        <a href={lnk.href} class:linkactive={(bURL + route_pageStr).startsWith(lnk.href)}>
          <IconText icon={lnk.icon} outlined={!lnk.icon_noutlined}>{lnk.text}</IconText>
        </a>
      {/each}
    </Drawer>

    <Nav loading={$route_loading}>
      <span> Chit Management System</span>
      <a href="/api/logout"> Logout </a>
    </Nav>
  </div>
</template>
