<template>
  <div id="map" v-bind:style="{ height: leafletHeight + 'px' }"></div>
</template>
<script>
import Mapa from './map/bpm'
var map

export default {
  name: 'leaflet-map',
  props: ['status', 'layerActive'],
  data () {
    return {
      leafletHeight: window.innerHeight / 1.25
    }
  },
  mounted () {
    // this.leafletHeight = window.innerHeight / 1.25
    map = new Mapa(this.map, 'map', this.status, this.layerActive, this)
    map.load()
  },
  watch: {
    layerActive: function (newVal, oldVal) { // watch it
      map.setLayerActive(newVal)
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
    },
    status: function (newVal, oldVal) {
      map.setStatus(newVal)
    }
  }
}
</script>
<style>
  .info {padding: 6px 8px; font: 16px; background: white; background: rgba(255,255,255,0.8); box-shadow: 0 0 15px rgba(0,0,0,0.2); border-radius: 5px; font-weight: bold; min-width: 100px}
  .info h4 { margin: 0 0 5px; color: #777; }
</style>
