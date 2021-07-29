import type { SvelteRouterMiddleware, SvelteRouterRoutes } from '@/router';

const tree: SvelteRouterRoutes = {
  dashboard: { component: () => import('./Dashboard.svelte') },
  clients: {
    component: () => import('./Clients/Clients.svelte'),
    routes: {
      add: { component: () => import('./Clients/Add.svelte') },
      'info/:client': { component: () => import('./Clients/Info.svelte') },
    },
  },
  about: { component: () => import('./About.svelte') },
  groups: {
    component: () => import('./Groups/Groups.svelte'),
    routes: {
      add: { component: () => import('./Groups/Add.svelte') },
    },
  },
};
const middleware: SvelteRouterMiddleware = router => router.on('/', () => router.route('/dashboard'));
export default { tree, middleware };
