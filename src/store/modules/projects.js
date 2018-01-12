import VueResource from 'vue-resource'
import Vue from 'vue'

Vue.use(VueResource)

/* eslint-disable */
export default {
  namespaced: true,
  state: {
    user: {
      id: 0,
      name: '',
      token: ''
    }
  },
  mutations: {
    setToken (state, token) {
      state.user.token = token
    }
  },
  actions: {
    login (context, form) {
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
    }
  }
}
/* eslint-enable */
