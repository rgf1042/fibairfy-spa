import VueResource from 'vue-resource'
import Vue from 'vue'
import InitialStates from '../../initial-states.js'

Vue.use(VueResource)

/* eslint-disable */
export default {
  namespaced: true,
  state: InitialStates.map(),
  getters : {
    currentLocation: state => {
      return { latitude: state.latitude, longitude: state.longitude, zoom: state.zoom }
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
    },
    reset (state) {
      state.latitude = InitialStates.map().latitude,
      state.longitude = InitialStates.map().longitude,
      state.zoom = InitialStates.map().zoom
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
