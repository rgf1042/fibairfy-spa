import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'

// Components
import Login from '@/components/Login'
import FiberMap from '@/components/FiberMap'
import Projects from '@/components/Projects'
import ProjectAdd from '@/components/ProjectAdd'
import SiteEdit from '@/components/SiteEdit'
import PathEdit from '@/components/PathEdit'
import Profile from '@/components/Profile'
import Export from '@/components/Export'

// Import navbars
import GeneralNavbar from '@/components/shared/general-navbar'
import LoginNavbar from '@/components/shared/login-navbar'
import BackNavbar from '@/components/shared/back-navbar'

Vue.use(Router)

const router = new Router({
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
      path: '/projects/add',
      name: 'ProjectAdd',
      components: {
        navbar: BackNavbar,
        view: ProjectAdd
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
    },
    {
      path: '/export',
      name: 'Export',
      components: {
        navbar: GeneralNavbar,
        view: Export
      },
      props: {
        navbar: {'exportActive': true},
        view: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/' || store.state.user.user.token) next() // If is login or you have a token
  else next('/')
})

export default router
