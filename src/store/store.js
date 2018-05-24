import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// Import modules store
import UserModule from './modules/user'
import ProjectsModule from './modules/projects'
import TemplatesModule from './modules/templates'

Vue.use(Vuex)

/* eslint-disable */
export default new Vuex.Store({
  modules: {
    user: UserModule,
    projects: ProjectsModule,
    templates: TemplatesModule
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })]
})
/* eslint-enable */
