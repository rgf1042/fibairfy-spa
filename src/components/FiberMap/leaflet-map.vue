<template>
  <div id="map"></div>
</template>
<script>
import Mapa from './map/bpm'
var map

export default {
  name: 'leaflet-map',
  props: ['status', 'layerActive'],
  data () {
    return {

    }
  },
  mounted () {
    console.log(this)
    map = new Mapa(this.map, 'map', this.status, this.layerActive, this)
    map.load()
  },
  watch: {
    layerActive: function (newVal, oldVal) { // watch it
      map.changeColor(newVal)
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
    }
  }
}
</script>
<style scoped>
  #map { height: 800px; }
</style>
