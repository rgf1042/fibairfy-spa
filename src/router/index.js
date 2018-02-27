import Vue from 'vue'
import Router from 'vue-router'

// Components
import Login from '@/components/Login'
import FiberMap from '@/components/FiberMap'
import Projects from '@/components/Projects'
import SiteEdit from '@/components/SiteEdit'
import PathEdit from '@/components/PathEdit'
import Profile from '@/components/Profile'

// Import navbars
import GeneralNavbar from '@/components/shared/general-navbar'
import LoginNavbar from '@/components/shared/login-navbar'
import BackNavbar from '@/components/shared/back-navbar'

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
    },
    {
      path: '/projects',
      name: 'Projects',
      components: {
        navbar: GeneralNavbar,
        view: Projects
      },
      props: {
        navbar: {'projectsActive': true},
        view: false
      }
    },
    {
      path: '/site/:id',
      name: 'SiteEdit',
      components: {
        navbar: BackNavbar,
        view: SiteEdit
      }
    },
    {
      path: '/path/:id',
      name: 'PathEdit',
      components: {
        navbar: BackNavbar,
        view: PathEdit
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      components: {
        navbar: GeneralNavbar,
        view: Profile
      }
    }
  ]
})
