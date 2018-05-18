import VueResource from 'vue-resource'
import Vue from 'vue'
import InitialStates from '../../initial-states.js'

Vue.use(VueResource)

/* eslint-disable */
export default {
  state: InitialStates.tubes(),
  getters: {
    tubesIndexes: state => idCable => {
      return state.cables[idCable]
    }
  },
  mutations: {
    addNewTube (state, tube) {
      Vue.set(state.tubes, tube.id, tube)
      Vue.set(state.cables, tube.cable, state.cables[tube.cable] || [])
      state.cables[tube.cable].push(tube.id) // We push index in cables to tubes array
    },
    addCableToTube (state, cable) { // We load this every time a new Site is created
      Vue.set(state.cables, cable.id, [])
    },
    updateTube (state, data) {
      Vue.set(state.tubes, data.id, data.tube)
    },
    deleteTube (state, id) {
      let idCable = state.tubes[id].cable
      let tubes = state.cables[idCable]
      for (let x in tubes) {
        if (tubes[x] === id) {
          tubes.splice(x, 1)
          break
        }
      }
      Vue.delete(state.tubes, id)
    },
    resetTubes (state) {
      state.tubes = InitialStates.tubes().tubes
      state.cables = InitialStates.tubes().cables
    }
  },
  actions: {
    loadTubes (context) {
      return new Promise((resolve, reject) => {
        context.commit('resetTubes')
        let cables = context.getters.cables // We load existing cables
        for (let x in cables) context.commit('addSiteToTube', cables[x])
        Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/tube/?project=' + context.getters.currentId + '&limit=10000&populate=null').then(response => {
          for (let x in response.body) {
            let tube = response.body[x]
            context.commit('addNewTube', tube)
          }
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    addNewTube (context, tube) {
      return new Promise((resolve, reject) => {
        Vue.http.post(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/tube/', tube).then(response => {
          Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/tube/' + response.body.id + '?populate=null').then(response => {
            context.commit('addNewTube', response.body)
            resolve(response)
          }, error => {
            reject(error)
          })
        }, error => {
          reject(error)
        })
      })
    },
    deleteTube (context, id) {
      return new Promise((resolve, reject) => {
        Vue.http.delete(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/tube/' + id).then(response => {
          context.commit('deleteTube', id)
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    updateTube (context, tube) {
      return new Promise((resolve, reject) => {
        Vue.http.put(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/tube/' + tube.id + '?populate=null', tube).then(response => {
          context.commit('updateTube', { id: tube.id, tube: response.body })
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    }
  }
}
