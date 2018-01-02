import Vue from 'vue'
import Router from 'vue-router'

// Components
import Login from '@/components/Login'
import FiberMap from '@/components/FiberMap'

// Import navbars
import GeneralNavbar from '@/components/shared/general-navbar'
import LoginNavbar from '@/components/shared/login-navbar'
// import BackNavbar from '@/components/shared/back-navbar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      components: {
        navbar: LoginNavbar,
        view: Login
      }
    },
    {
      path: '/',
      name: 'Login',
      components: {
        navbar: LoginNavbar,
        view: Login
      }
    },
    {
      path: '/map',
      name: 'Map',
      components: {
        navbar: GeneralNavbar,
        view: FiberMap
      },
      props: {
        navbar: {'mapActive': true},
        view: false
      }
    }
  ]
})
