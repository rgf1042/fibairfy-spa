import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* eslint-disable */
export default new Vuex.Store({
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
    },
    setUserId (state, id) {
      state.user.id = id
    },
    setUserName (state, name) {
      state.user.name = name
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
})
/* eslint-enable */
