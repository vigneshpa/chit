<script lang="ts">
  import { getContext, setContext, hasContext } from 'svelte';
  import navaid from 'navaid';
  import type { Router, RouteHandler } from 'navaid';
  import { get, Writable, writable } from 'svelte/store';
  import type { SvelteComponent, SvelteRouterMiddleware, SvelteRouterRoutes } from '.';

  // Params

  export let base = '/';
  export let tree: SvelteRouterRoutes = {};
  export let middleware: SvelteRouterMiddleware = () => {};

  let component: SvelteComponent | undefined;

  let components: Writable<SvelteComponent[]> | null = hasContext('svelte-navaid-components') ? getContext('svelte-navaid-components') : null;
  let routerIndex: Writable<number> | null = hasContext('svelte-navaid-routerIndex') ? getContext('svelte-navaid-routerIndex') : null;
  let index = -1;

  if (!components) {
    if (window['svelte-router']?.router)
      throw new Error('Already a router exists. Do not initilise router for multiple times unless it is for subroutes!');
    const router = navaid(base);
    window['svelte-router'].router = router;
    components = parser(tree, router); // Creating strore
    routerIndex = writable(-1); // Setting router index
    Promise.resolve(middleware(router)).then(() => router.listen());
  }

  function parser(routes: SvelteRouterRoutes, router: Router, prefix: string = '', prerun?: () => Promise<SvelteComponent[]>) {
    const comps = typeof prerun === 'function' ? null : writable<SvelteComponent[]>([]);
    prerun = typeof prerun === 'function' ? prerun : () => Promise.resolve([]);
    for (const route in routes) {
      if (Object.prototype.hasOwnProperty.call(routes, route)) {
        const pageStr = prefix + '/' + route;
        const activate = async () => {
          const cps: SvelteComponent[] = await prerun!();
          cps.push((await routes[route].component()).default);
          if (comps) comps.set(cps);
          return cps;
        };
        if (routes[route].routes) parser(routes[route].routes as SvelteRouterRoutes, router, pageStr, activate);
        router.on(pageStr, activate);
      }
    }
    return comps;
  }

  index = get(routerIndex!) + 1;
  routerIndex!.set(index);

  setContext('svelte-navaid-components', components);
  setContext('svelte-navaid-routerIndex', routerIndex);

  const hasChildRouteComp = writable<boolean>();
  components!.subscribe(comps => {
    console.log(comps);
    component = comps[index];
    hasChildRouteComp.set(comps[index + 1] ? true : false);
  });
</script>

<template>
  {#key component}
    <svelte:component this={component} {hasChildRouteComp} />
  {/key}
</template>
