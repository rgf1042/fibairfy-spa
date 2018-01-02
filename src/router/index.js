import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import FiberMap from '@/components/FiberMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/map',
      name: 'Map',
      component: FiberMap
    }
  ]
})
