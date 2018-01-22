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
      latitude: 0.0,
      longitude: 0.0,
      zoom: 0,
      sites: [],
      paths: []
    },
    list: []
  },
  mutations: {
    setCurrentProject (state, current) {
      state.current = current
    },
    setListProjects (state, list) {
      state.list = list
    },
    addNewSite (state, site) {
      state.current.sites.push(site)
    },
    addNewPath (state, path) {
      state.current.paths.push(path)
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
            latitude: response.body.latitude,
            longitude: response.body.longitude,
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
            Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/path/?project=' + id).then(response => {
              for (let x in response.body) {
                delete response.body[x].project
                context.commit('addNewPath', response.body[x])
              }
            }, error => {
              reject(error)
            })
            resolve(response)
          }, error => {
            reject(error)
          })

        }, error => {
          // http failed, let the calling function know that action did not work out
          reject(error)
        })
      })
    },
    updateCurrent (context, form) {

    },
    loadProjectsList (context) {
      return new Promise((resolve, reject) => {
        Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/project/').then(response => {
          // success callback
          context.commit('setListProjects', response.body)
          resolve(response)
        }, error => {
          // http failed, let the calling function know that action did not work out
          reject(error)
        })
      })
    }

  }
}
/* eslint-enable */
