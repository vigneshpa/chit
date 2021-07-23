<script lang="ts">
  import { getContext, setContext, hasContext } from 'svelte';
  import navaid from 'navaid';
  import type { Router } from 'navaid';
  import { writable } from 'svelte/store';
  import type { SvelteComponent, SvelteRouterContext, SvelteRouterMiddleware, SvelteRouterRoutes } from '.';

  // Params

  export let base = '/';
  export let tree: SvelteRouterRoutes = {};
  export let middleware: SvelteRouterMiddleware = () => {};

  let component: SvelteComponent | null;

  const ctxSuper: SvelteRouterContext | false = hasContext('svelte-navaid') ? getContext('svelte-navaid') : false;

  if (!ctxSuper) {
    // Loading router
    if (window['svelte-router'].router)
      throw new Error('window["svelte-router"] is already loaded; Do not use router multiple times except for subroutes');
    const router = navaid(base);
    window['svelte-router'].router = router;

    const v = handleRoutes(tree, router);
    const ctx = v.childCtx;
    v.component.subscribe(val => (component = val));

    // Setting Context
    setContext('svelte-navaid', ctx);

    // Function to generate context and handle routes
    function handleRoutes(routes: SvelteRouterRoutes, router: Router, prepend: string = '') {
      let component = writable<SvelteComponent | null>();
      let childCtx: SvelteRouterContext | undefined;
      for (const path in routes)
        if (Object.prototype.hasOwnProperty.call(routes, path)) {
          const pageStr = prepend + '/' + path ;
          console.log('Registering route', pageStr);

          // Registering route
          router.on(pageStr, async params => {
            window['svelte-router'].isLoading.set(true);
            window['svelte-router'].params.set(params);
            component.set(await routes[path].component());  // Setting the page component
            childCtx?.component.set(null);                  // Closing child routes if exists
            window['svelte-router'].pageStr.set(pageStr);
            window['svelte-router'].isLoading.set(false);
          });

          // Registering subroutes
          if (routes[path].routes) {
            childCtx = handleRoutes(<SvelteRouterRoutes>routes[path].routes, router, pageStr);
          }
        }
      return { component, childCtx };
    }
    Promise.resolve(middleware(router)).then(() => router.listen());
  } else {
    ctxSuper.component.subscribe(com => (component = com));
    if (ctxSuper.childCtx) {
      setContext('svelte-navaid', ctxSuper.childCtx);
    }
  }
</script>

<template>
  <svelte:component this={component} />
</template>
