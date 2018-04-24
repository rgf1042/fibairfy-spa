import VueResource from 'vue-resource'
import Vue from 'vue'
import InitialStates from '../../initial-states.js'

Vue.use(VueResource)

/* eslint-disable */
export default {
  state: InitialStates.boxes(),
  getters: {
    findBoxById: state => id => {
      return state.boxes.find(item => item.id === id)
    },
    findBoxIndexById: state => id => {
      return state.boxes.findIndex(item => item.id === id)
    }
  },
  mutations: {
    addNewBox (state, box) {
      state.boxes.push(box)
      state.sites[box.site] = state.sites[box.site] || []
      state.sites[box.site].push(state.boxes.length - 1) // We push index in sites to boxes array
    },
    updateBox (state, data) {
      state.boxes[data.index] = data.site
    },
    deleteBox (state, index) {
      let id = state.boxes[index].site
      let boxes = state.sites[id]
      for (let x in boxes) {
        if (boxes[x] === index) {
          boxes.splice(boxes[x], 1)
          break
        }
      }
      state.boxes.splice(index, 1)
    },
    resetBoxes (state) {
      state.boxes = InitialStates.boxes().boxes
      state.sites = InitialStates.boxes().sites
    }
  },
  actions: {
    loadBoxes (context) {
      return new Promise((resolve, reject) => {
        context.commit('resetBoxes')
        Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/box/?project=' + context.getters.currentId + '&limit=10000&populate=null').then(response => {
          for (let x in response.body) {
            let box = response.body[x]
            context.commit('addNewBox', box)
          }
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    addNewBox (context, box) {
      return new Promise((resolve, reject) => {
        Vue.http.post(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/box/', box).then(response => {
          Vue.http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/box/' + response.body.id).then(response => {
            context.commit('addNewBox', response.body)
            resolve(response)
          }, error => {
            reject(error)
          })
        }, error => {
          reject(error)
        })
      })
    },
    deleteBox (context, id) {
      return new Promise((resolve, reject) => {
        let index = context.getters.findBoxIndexById(id)
        if (index !== -1) {
          Vue.http.delete(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/box/' + id).then(response => {
            context.commit('deleteBox', index)
            resolve(response)
          }, error => {
            reject(error)
          })
        }
        else {
          reject({ msg: 'This box doesnt exist'})
        }
      })
    },
    updateBox (context, box) {
      return new Promise((resolve, reject) => {
        let index = context.getters.findBoxIndexById(box.id)
        if (index !== -1) {
          Vue.http.put(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/box/' + box.id, box).then(response => {
            context.commit('updateBox', { index: index, site: response.body })
            resolve(response)
          }, error => {
            reject(error)
          })
        }
        else {
          reject({ msg: 'This box doesnt exist'})
        }
      })
    },
    findBoxById (context, id) {
      return new Promise((resolve, reject) => {
        resolve(context.getters.findBoxById(id))
      })
    }
  }
}
