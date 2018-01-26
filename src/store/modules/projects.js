import VueResource from 'vue-resource'
import Vue from 'vue'

// Internal modules
import SitesModule from './projects/sites'
import PathsModule from './projects/paths'
import MapModule from './projects/map'

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
      zoom: 0
    },
    list: []
  },
  getters : {
    currentId: state => {
      return state.current.id
    }
  },
  mutations: {
    setCurrentProject (state, current) {
      state.current = current
    },
    setListProjects (state, list) {
      state.list = list
    },
    addNewProject (state, project) {
      state.list.push(project)
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
            zoom: response.body.zoom
          }
          context.commit('setCurrentProject', project)
          context.dispatch('map/setLocation', { latitude: project.latitude, longitude: project.longitude })
          context.dispatch('map/setZoom', project.zoom)
          // We load sites
          context.dispatch('loadSites').then(response => {
            context.dispatch('loadPaths').then(response => {
              resolve(response)
            }, error => {
              reject(error)
            })
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
    },
    addNewProject (context, name) {
      return new Promise((resolve, reject) => {
        let project = {
          name: name,
          status: 'define',
          latitude: fiberfy.constants.PROJECT_DEFAULT_LATITUDE,
          longitude: fiberfy.constants.PROJECT_DEFAULT_LONGITUDE,
          zoom: fiberfy.constants.PROJECT_DEFAULT_ZOOM
        }
        Vue.http.post(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/project/', project).then(response => {
          Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/project/' + response.body.project).then(response => {
            context.commit('addNewProject', response.body)
            resolve(response)
          }, error => {
            reject(error)
          })
        }, error => {
          reject(error)
        })
      })
    }
  },
  modules: {
    sites: SitesModule,
    paths: PathsModule,
    map: MapModule
  }
}
/* eslint-enable */
