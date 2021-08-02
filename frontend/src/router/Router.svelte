<script lang="ts">
  import { getContext, setContext, hasContext } from 'svelte';
  import navaid from 'navaid';
  import type { Router } from 'navaid';
  import { Writable, writable } from 'svelte/store';
  import type { SvelteComponent, SvelteRouterMiddleware, SvelteRouterRoutes } from '.';

  // Params

  export let base = '/';
  export let tree: SvelteRouterRoutes = {};
  export let middleware: SvelteRouterMiddleware = () => {};
  export let verbose: boolean = false;

  let component: SvelteComponent | undefined;

  let components: Writable<SvelteComponent[]> = hasContext('svelte-navaid-components')
    ? getContext('svelte-navaid-components')
    : (null as unknown as Writable<SvelteComponent[]>);
  let routerIndex: number = hasContext('svelte-navaid-routerIndex') ? getContext('svelte-navaid-routerIndex') : -1;
  let index = -1;

  if (!components) {
    if (window['svelte-router']?.router)
      throw new Error('Already a router exists. Do not initilise router for multiple times unless it is for subroutes!');
    const router = navaid(base);
    window['svelte-router'].router = router;
    components = parser(tree, router); // Creating strore
    Promise.resolve(middleware(router)).then(() => router.listen());
    function parser(
      routes: SvelteRouterRoutes,
      router: Router,
      prefix: string = '',
      prerun?: () => Promise<SvelteComponent[]>,
      comps: Writable<SvelteComponent[]> = writable([])
    ) {
      for (const route in routes) {
        if (Object.prototype.hasOwnProperty.call(routes, route)) {
          const pageStr = prefix + '/' + route;
          const activate = async (set: boolean = false) => {
            const cps: SvelteComponent[] = prerun ? await prerun!() : [];
            cps.push((await routes[route].component()).default);
            if (set) comps.set(cps);
            return cps;
          };
          if (routes[route].routes) parser(routes[route].routes as SvelteRouterRoutes, router, pageStr, activate, comps);
          if (verbose) console.log('Registering route', pageStr);
          router.on(pageStr, async params => {
            window['svelte-router'].isLoading.set(true);
            await activate(true);
            window['svelte-router'].isLoading.set(false);
            window['svelte-router'].params.set(params);
            window['svelte-router'].pageStr.set(pageStr);
          });
        }
      }
      return comps;
    }
  }

  index = routerIndex + 1;

  setContext('svelte-navaid-components', components);
  setContext('svelte-navaid-routerIndex', index);

  const hasChildRouteComp = writable<boolean>();
  $: component = $components[index];
  $: $hasChildRouteComp = $components[index + 1] ? true : false;
</script>

<template>
  <svelte:component this={component} {hasChildRouteComp} />
</template>
