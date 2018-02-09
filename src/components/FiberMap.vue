<template>
  <div>
    <leaflet-map :status="status" :layerActive="layerActive"
      v-on:edit-site="editSite($event)"
      v-on:edit-path="editPath($event)"></leaflet-map>
    <map-controls v-on:set-status="setStatus($event)" v-on:set-layer="setLayer($event)" :status="status" :layerActive="layerActive"></map-controls>
  </div>
</template>

<script>
/* eslint-disable */
import L from 'leaflet'
import LeafletMap from '@/components/FiberMap/leaflet-map'
import MapControls from '@/components/FiberMap/map-controls'

export default {
  name: 'FiberMap',
  components: {
    'leaflet-map': LeafletMap,
    'map-controls': MapControls
  },
  data () {
    return {
      status: '',
      layerActive: 'civil'
    }
  },
  methods: {
    setStatus (status) {
      this.status = status
    },
    setLayer (layer) {
      this.layerActive = layer
      this.status = ''
    },
    editSite (id) {
      this.$router.push({ name: 'SiteEdit', params: { id: id }})
    },
    editPath (id) {
      this.$router.push({ name: 'PathEdit', params: { id: id }})
    }
  }

}
</script>
