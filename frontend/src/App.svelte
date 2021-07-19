<script lang="ts">
  import { Container, Drawer, IconText, Nav, Confirm } from '@theme/';
  import Router from './routes/index.svelte';
  let route_loading = window.route.isLoading;
  let drawer_links = [
    { href: '/app/dashboard', text: 'Dashboard', icon: 'space_dashboard', icon_noutlined: false },
    { href: '/app/users', text: 'Users', icon: 'people' },
    { href: '/app/groups', text: 'Groups', icon: 'groups' },
    { href: '/app/about', text: 'About', icon: 'info' },
  ];
  let route_pageStr: string = '';
  window.route.pageStr.subscribe(val => (route_pageStr = val));
</script>

<template>
  <div id="app">
    <Container>
      <Router />
    </Container>

    <Drawer>
      {#each drawer_links as lnk}
        <a href={lnk.href} class:linkactive={('/app' + route_pageStr).startsWith(lnk.href)}>
          <IconText icon={lnk.icon} outlined={!lnk.icon_noutlined}>{lnk.text}</IconText>
        </a>
      {/each}
    </Drawer>

    <Nav loading={$route_loading}>
      <span> Chit Management System</span>
      <a href="/api/logout"> Logout </a>
    </Nav>

    <Confirm />
  </div>
</template>
