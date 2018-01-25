import VueResource from 'vue-resource'
import Vue from 'vue'

Vue.use(VueResource)

/* eslint-disable */
export default {
  state: {
    sites: []
  },
  mutations: {
    addNewSite (state, site) {
      state.sites.push(site)
    },
    loadSiteArray (state, sites) {
      state.sites = sites
    }
  },
  actions: {
    loadSites (context) {
      return new Promise((resolve, reject) => {
        Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/site/?project=' + context.getters.currentId).then(response => {
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
    }
  }
}
