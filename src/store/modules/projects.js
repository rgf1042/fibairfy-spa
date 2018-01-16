import VueResource from 'vue-resource'
import Vue from 'vue'

Vue.use(VueResource)

/* eslint-disable */
export default {
  namespaced: true,
  state: {
    current {
      id: 0,
      name: '',
      pos {
        lat: 0,
        long: 0
      },
      zoom: 0
    }
  },
  mutations: {
    setCurrentProject (state, curremt) {
      state.current = current
    },
  },
  actions: {
    setCurrent (context, current) {
      return new Promise((resolve, reject) => {
        // Do something here... lets say, a http call using vue-resource
        Vue.http.post('http://localhost:1337/auth/login', form).then(response => {
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
      })
    },
    updateCurrent (context, form) {

    }
  }
}
/* eslint-enable */
