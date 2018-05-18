// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import VueResource from 'vue-resource'
import store from './store/store'
import VueI18n from 'vue-i18n'
import i18n from './lang/lang'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-search/dist/leaflet-search.min.css'
import 'octicons/build/build.css'

// require('../node_modules/leaflet/dist/leaflet.css')
Vue.use(BootstrapVue)
Vue.use(VueResource)
Vue.use(VueI18n)

Vue.http.interceptors.push(function (request, next) {
  // modify headers
  if (store.state.user.user.token) {
    request.headers.set('Authorization', 'Bearer ' + store.state.user.user.token)
  }
  // continue to next interceptor
  next()
})

Vue.config.productionTip = false

const EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  i18n,
  router,
  template: '<App/>',
  components: { App }
})
