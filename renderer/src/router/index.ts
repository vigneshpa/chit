import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import("@/views/dashboard.vue"),
    meta: {
      icon: "mdi-view-dashboard",
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/users.vue'),
    meta: {
      icon: "mdi-account-multiple",
    }
  },
  {
    path: "/groups",
    name: "Groups",
    component: () => import('@/views/groups.vue'),
    meta: {
      icon: "mdi-account-group",
    }
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import('@/views/settings.vue'),
    props: {
      config: window.config
    },
    meta: {
      icon: "mdi-cog",
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
