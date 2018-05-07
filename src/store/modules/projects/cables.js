import VueResource from 'vue-resource'
import Vue from 'vue'
import InitialStates from '../../initial-states.js'

Vue.use(VueResource)

/* eslint-disable */
export default {
  state: InitialStates.cables(),
  getters: {
    findCableById: state => id => {
      return state.cables[id]
    }
  },
  mutations: {
    addNewCable (state, cable) {
      Vue.set(state.cables, cable.id, cable)
    },
    updateCable (state, cable) {
      Vue.set(state.cables, cable.id, cable)
    },
    deleteCable (state, id) {
      Vue.delete(state.cables, id)
    },
    resetCables (state) {
      state.cables = InitialStates.cables().cables
    }
  },
  actions: {
    loadCables (context) {
      return new Promise((resolve, reject) => {
        context.commit('resetCables')
        Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/cable/?project=' + context.getters.currentId + '&limit=1000000&populate=null').then(response => {
          for (let x in response.body) {
            let cable = response.body[x]
            context.commit('addNewCable', cable)
          }
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    addNewCable (context, cable) {
      return new Promise((resolve, reject) => {
        Vue.http.post(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/cable/', cable).then(response => {
          Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/cable/' + response.body.id + '?populate=null').then(response => {
            context.commit('addNewCable', response.body)
            resolve(response)
          }, error => {
            reject(error)
          })
        }, error => {
          reject(error)
        })
      })
    },
    deleteCable (context, id) {
      return new Promise((resolve, reject) => {
        Vue.http.delete(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/cable/' + id).then(response => {
          context.commit('deleteCable', id)
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    updateCable (context, cable) {
      return new Promise((resolve, reject) => {
        Vue.http.put(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/cable/' + cable.id, cable).then(response => {
          context.commit('updateCable', response.body)
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    }
  }
}
