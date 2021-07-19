<script lang="ts">
  let route_params = window.route.params;
  let pageComp: any;

  const lp = (path: string, ldr: () => Promise<any>) =>
    [
      path,
      async params => {
        window.route.params.set(params);
        window.route.isLoading.set(true);

        pageComp = (await ldr()).default;
        window.route.pageStr.set(path);
        window.route.isLoading.set(false);
      },
    ] as [string, (params: any) => Promise<void>];

  const routes: { [path: string]: () => Promise<typeof import('*.svelte')> } = {
    '/dashboard': () => import('./Dashboard.svelte'),
    '/users': () => import('./Users.svelte'),
    '/users/:user': () => import('./UsersInfo.svelte'),
    '/about': () => import('./About.svelte'),
    '/groups/': () => import('./Group.svelte'),
  };

  for (const path in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, path)) {
      const args = lp(path, routes[path]);
      window.route.router.on(...args);
    }
  }
  window.route.router.on('/', () => window.route.router.route('/dashboard'));
  window.route.router.listen();
</script>

<template>
  <svelte:component this={pageComp} {route_params} />
</template>
