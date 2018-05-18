import VueResource from 'vue-resource'
import Vue from 'vue'
import InitialStates from '../initial-states.js'

Vue.use(VueResource)

/* eslint-disable */
export default {
  namespaced: true,
  state: InitialStates.user(),
  mutations: {
    setToken (state, token) {
      state.user.token = token
    },
    setUserId (state, id) {
      state.user.id = id
    },
    setUserName (state, name) {
      state.user.name = name
    },
    reset (state) {
      state.user = InitialStates.user().user
      state.locale = InitialStates.user().locale
    },
    setLocale (state, locale) {
      state.locale = locale
    }
  },
  getters: {
    currentId: state => {
      return state.user.id
    }
  },
  actions: {
    login (context, form) {
      return new Promise((resolve, reject) => {
        // Do something here... lets say, a http call using vue-resource
        if (form.auth === 'Local') {
          delete form.auth
          Vue.http.post(fiberfy.constants.BASE_URL + '/auth/login', form).then(response => {
            // success callback
            if (response.body.flag) {
              context.commit('setToken', response.body.token)
              context.commit('setUserId', response.body.user.id)
              context.commit('setUserName', response.body.user.username)
              resolve(response)  // Let the calling function know that http is done. You may send some data back
            }
            reject(response)
          }, error => {
            // http failed, let the calling function know that action did not work out
            reject(error)
          })
        }
        else {
          delete form.auth
          Vue.http.post(fiberfy.constants.BASE_URL + '/auth/loginLDAP', form).then(response => {
            // success callback
            if (response.body.flag) {
              context.commit('setToken', response.body.token)
              context.commit('setUserId', response.body.user.id)
              context.commit('setUserName', response.body.user.username)
              resolve(response)  // Let the calling function know that http is done. You may send some data back
            }
            reject(response)
          }, error => {
            // http failed, let the calling function know that action did not work out
            reject(error)
          })
        }
      })
    },
    logout (context) {
      context.commit('reset')
      context.commit('projects/reset', null, { root: true })
      context.commit('projects/map/reset', null, { root: true })
      context.commit('projects/resetSites', null, { root: true })
      context.commit('projects/resetPaths', null, { root: true })
      context.commit('projects/resetBoxes', null, { root: true })
      context.commit('projects/resetCables', null, { root: true })
      context.commit('projects/resetTubes', null, { root: true })
      context.commit('projects/resetFibers', null, { root: true })
    },
    changeLocale (context, locale) {
      context.commit('setLocale', locale)
    }
  }
}
/* eslint-enable */
