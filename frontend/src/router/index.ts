export { default as Router } from './Router.svelte';
import type { Router as SvelteRouter } from 'navaid';
import type { SvelteComponent as SC } from 'svelte';
import { writable, Writable } from 'svelte/store';
export type SvelteComponent = typeof SC;
export interface SvelteRouterRoutes {
  [route: string]: { component: () => Promise<{default:SvelteComponent}> | {default:SvelteComponent}; routes?: SvelteRouterRoutes };
}
export interface SvelteRouterMiddleware{
  (router:SvelteRouter):Promise<any> | any;
}
export interface SvelteRouterParameters{
  hasChildRouteComp:Writable<boolean>;
}
window['svelte-router'] = { isLoading: writable(false), params: writable({}), pageStr: writable('') };

declare global {
  interface Window {
    'svelte-router': {
      router?: SvelteRouter;
      isLoading: Writable<boolean>;
      params:Writable<any>;
      pageStr:Writable<string>;
    };
  }
}
