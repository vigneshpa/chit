import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Dashboard',
    component: ()=> import("../views/dashboard.vue"),
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/users.vue')
  },
  {
    path:"/groups",
    name:"Groups",
    component: () => import('../views/groups.vue')
  },
  {
    path:"/settings",
    name:"Settings",
    component: ()=> import('../views/settings.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
