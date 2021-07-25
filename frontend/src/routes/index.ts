import type { SvelteRouterMiddleware, SvelteRouterRoutes } from '@/router';

const tree: SvelteRouterRoutes = {
  dashboard: { component:  () => import('./Dashboard.svelte')},
  clients: {
    component: () => import('./Clients/Clients.svelte'),
    routes: {
      'info/:client': { component: () => import('./Clients/Info.svelte') },
      add: { component: () => import('./Clients/Add.svelte') },
    },
  },
  about: { component: () => import('./About.svelte') },
  groups: { component: () => import('./Group.svelte') },
};
const middleware: SvelteRouterMiddleware = router => router.on('/', () => router.route('/dashboard'));
export default { tree, middleware };
