import VueResource from 'vue-resource'
import Vue from 'vue'

Vue.use(VueResource)

/* eslint-disable */
export default {
  namespaced: true,
  state: {
    latitude: 0.0,
    longitude: 0.0
  },
  getters : {
    currentLocation: state => {
      return { latitude: state.latitude, longitude: state.longitude }
    }
  },
  mutations: {
    setLatitude (state, latitude) {
      state.latitude = latitude
    },
    setLongitude (state, longitude) {
      state.longitude = longitude
    }
  },
  actions: {
    setLocation (context, location) {
      context.commit('setLatitude', location.latitude)
      context.commit('setLongitude', location.longitude)
    }
  }
}
