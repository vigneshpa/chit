import type { SvelteRouterMiddleware, SvelteRouterRoutes } from '@/router';

const tree: SvelteRouterRoutes = {
  'dashboard': { component: async () => (await import('./Dashboard.svelte')).default },
  'users': {
    component: async () => (await import('./Users.svelte')).default,
    routes: {
      'info/:user': { component: async () => (await import('./UsersInfo.svelte')).default },
      'add': { component: async () => (await import('./UsersAdd.svelte')).default },
    }
  },
  'about': { component: async () => (await import('./About.svelte')).default },
  'groups': { component: async () => (await import('./Group.svelte')).default },
};
const middleware:SvelteRouterMiddleware = (router)=>router.on('/', ()=>router.route('/dashboard'));
export default {tree, middleware};
