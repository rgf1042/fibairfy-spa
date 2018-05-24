import VueResource from 'vue-resource'
import Vue from 'vue'
import InitialStates from '../initial-states.js'

Vue.use(VueResource)

/* eslint-disable */
export default {
  namespaced: true,
  state: InitialStates.templates(),
  mutations: {
    setFiberTemplates (state, templates) {
      state.fiberTemplates = templates
    },
    reset (state) {
      state.fiberTemplates = InitialStates.templates().fiberTemplates
    }
  },
  getters: {

  },
  actions: {
    loadFiberTemplates (context) {
      return new Promise((resolve, reject) => {
        Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/fibertemplate/?limit=1000000').then(response => {
          context.commit('setFiberTemplates', response.body)
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    }
  }
}
/* eslint-enable */
