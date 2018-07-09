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
    },
    currentLayer: state => {
      return state.layer
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
    setLayer (state, layer) {
      state.layer = layer
    },
    setSelectedBaseTile (state, base) {
      state.selectedBaseTile = base
    },
    addSelectedOverlayTile (state, overlay) {
      state.selectedOverlayTiles.push(overlay)
    },
    removeSelectedOverlayTile (state, overlay) {
      let index = state.selectedOverlayTiles.findIndex(function (e) {
        return (e === overlay)
      })
      state.selectedOverlayTiles.splice(index, 1)
    },
    reset (state) {
      state.latitude = InitialStates.map().latitude,
      state.longitude = InitialStates.map().longitude,
      state.zoom = InitialStates.map().zoom
      state.layer = InitialStates.map().layer
    }
  },
  actions: {
    setLocation (context, location) {
      context.commit('setLatitude', location.latitude)
      context.commit('setLongitude', location.longitude)
    },
    setZoom (context, zoom) {
      context.commit('setZoom', zoom)
    },
    setLayer (context, layer) {
      context.commit('setLayer', layer)
    },
    setSelectedBaseTile (context, base) {
      context.commit('setSelectedBaseTile', base)
    },
    addSelectedOverlayTile (context, overlay) {
      context.commit('addSelectedOverlayTile', overlay)
    },
    removeSelectedOverlayTile (context, overlay) {
      context.commit('removeSelectedOverlayTile', overlay)
    }
  }
}
