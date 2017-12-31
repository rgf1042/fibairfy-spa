<template>
  <div id="map"></div>
</template>

<script>
/* eslint-disable */
import L from 'leaflet'

export default {
  name: 'FiberMap',
  data () {
    return {

    }
  },
  mounted () {
    this.map = L.map('map')
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  	var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib})

  	// start the map in South-East England
  	this.map.setView(new L.LatLng(51.3, 0.7),9)
  	this.map.addLayer(osm)
  }
}
</script>
<style scoped>
  #map { height: 800px; }
</style>
