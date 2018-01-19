import VueResource from 'vue-resource'
import Vue from 'vue'

Vue.use(VueResource)

/* eslint-disable */
export default {
  namespaced: true,
  state: {
    current: {
      id: 0,
      name: '',
      pos: {
        lat: 0,
        long: 0
      },
      zoom: 0,
      sites: [],
      paths: []
    }
  },
  mutations: {
    setCurrentProject (state, current) {
      state.current = current
    },
    addNewSite (state, site) {
      state.current.sites.push(site)
    }
  },
  actions: {
    setCurrent (context, id) {
      return new Promise((resolve, reject) => {
        // Do something here... lets say, a http call using vue-resource
        Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/project/' + id).then(response => {
          // success callback
          let project = {
            id: response.body.id,
            name: response.body.name,
            pos: {
              lat: response.body.latitude,
              long: response.body.longitude
            },
            zoom: response.body.zoom,
            sites: [],
            paths: []
          }
          context.commit('setCurrentProject', project)

          // We load sites
          Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/site/?project=' + id).then(response => {
            for (let x in response.body) {
              delete response.body[x].project
              context.commit('addNewSite', response.body[x])
            }
            resolve(response)
          }, error => {
            reject(error)
          })

          resolve(response)  // Let the calling function know that http is done. You may send some data back
        }, error => {
          // http failed, let the calling function know that action did not work out
          reject(error)
        })
      })
    },
    updateCurrent (context, form) {

    }
  }
}
/* eslint-enable */
