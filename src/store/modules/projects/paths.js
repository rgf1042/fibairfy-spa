import VueResource from 'vue-resource'
import Vue from 'vue'

Vue.use(VueResource)

/* eslint-disable */
export default {
  state: {
    paths: []
  },
  mutations: {
    addNewPath (state, path) {
      state.paths.push(path)
    },
    loadPathArray (state, paths) {
      state.paths = paths
    }
  },
  actions: {
    loadPaths (context) {
      return new Promise((resolve, reject) => {
        Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/path/?project=' + context.getters.currentId).then(response => {
          context.commit('loadPathArray', response.body)
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    addNewPath (context, path) {
      return new Promise((resolve, reject) => {
        Vue.http.post(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/path/', path).then(response => {
          Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/path/' + response.body.id).then(response => {
            context.commit('addNewPath', response.body)
            resolve(response)
          }, error => {
            reject(error)
          })
        }, error => {
          reject(error)
        })
      })
    }
  }
}
