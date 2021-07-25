import type { SvelteRouterMiddleware, SvelteRouterRoutes } from '@/router';

const tree: SvelteRouterRoutes = {
  dashboard: { component:  () => import('./Dashboard.svelte')},
  users: {
    component: () => import('./Users/Users.svelte'),
    routes: {
      'info/:user': { component: () => import('./Users/Info.svelte') },
      add: { component: () => import('./Users/Add.svelte') },
    },
  },
  about: { component: () => import('./About.svelte') },
  groups: { component: () => import('./Group.svelte') },
};
const middleware: SvelteRouterMiddleware = router => router.on('/', () => router.route('/dashboard'));
export default { tree, middleware };
