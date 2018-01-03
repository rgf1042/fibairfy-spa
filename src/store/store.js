import Vue from 'vue'
import Vuex from 'vuex'

// Import modules store
import UserModule from './modules/user'

Vue.use(Vuex)

/* eslint-disable */
export default new Vuex.Store({
  modules: {
    user: UserModule
  }
})
/* eslint-enable */
