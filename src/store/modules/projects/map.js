import VueResource from 'vue-resource'
import Vue from 'vue'

Vue.use(VueResource)

/* eslint-disable */
export default {
  namespaced: true,
  state: {
    latitude: 0.0,
    longitude: 0.0,
    zoom: 1
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
    },
    setZoom (state, zoom) {
      state.zoom = zoom
    }
  },
  actions: {
    setLocation (context, location) {
      context.commit('setLatitude', location.latitude)
      context.commit('setLongitude', location.longitude)
    },
    setZoom (context, zoom) {
      context.commit('setZoom', zoom)
    }
  }
}
