import VueResource from 'vue-resource'
import Vue from 'vue'
import InitialStates from '../../initial-states.js'

Vue.use(VueResource)

/* eslint-disable */
export default {
  state: InitialStates.sites(),
  getters: {
    findSiteById: state => id => {
      return state.sites.find(item => item.id === id)
    },
    findSiteIndexById: state => id => {
      return state.sites.findIndex(item => item.id === id)
    }
  },
  mutations: {
    addNewSite (state, site) {
      state.sites.push(site)
    },
    updateSite (state, data) {
      state.sites[data.index] = data.site
    },
    deleteSite (state, index) {
      state.sites.splice(index, 1)
    },
    loadSiteArray (state, sites) {
      state.sites = sites
    },
    resetSites (state) {
      state.sites = InitialStates.sites().sites
      state.types = InitialStates.sites().types
    }
  },
  actions: {
    loadSites (context) {
      return new Promise((resolve, reject) => {
        Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/site/?project=' + context.getters.currentId + '&limit=1000000').then(response => {
          context.commit('loadSiteArray', response.body)
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    addNewSite (context, site) {
      return new Promise((resolve, reject) => {
        Vue.http.post(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/site/', site).then(response => {
          Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/site/' + response.body.id).then(response => {
            context.commit('addNewSite', response.body)
            resolve(response)
          }, error => {
            reject(error)
          })
        }, error => {
          reject(error)
        })
      })
    },
    deleteSite (context, id) {
      return new Promise((resolve, reject) => {
        let index = context.getters.findSiteIndexById(id)
        if (index !== -1) {
          Vue.http.delete(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/site/' + id).then(response => {
            context.commit('deleteSite', index)
            resolve(response)
          }, error => {
            reject(error)
          })
        }
        else {
          reject({ msg: 'This site doesnt exist'})
        }
      })
    },
    updateSite (context, site) {
      return new Promise((resolve, reject) => {
        let index = context.getters.findSiteIndexById(site.id)
        if (index !== -1) {
          Vue.http.put(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/site/' + site.id, site).then(response => {
            context.commit('updateSite', { index: index, site: response.body })
            resolve(response)
          }, error => {
            reject(error)
          })
        }
        else {
          reject({ msg: 'This site doesnt exist'})
        }
      })
    },
    findSiteById (context, id) {
      return new Promise((resolve, reject) => {
        resolve(context.getters.findSiteById(id))
      })
    }
  }
}
