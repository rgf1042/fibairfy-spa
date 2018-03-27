<template>
  <b-container>
    <b-row>
      <b-col sm="2" class="pt-2">
        <h3>{{$t('menu.export')}}</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="1" class="pt-2">

      </b-col>
    </b-row>

    <b-button :href="this.getGeoJSON" :download="this.project.name + '.geojson'">{{$t('general.download')}}</b-button>
  </b-container>
</template>
<script>
import GeoJSON from 'geojson'

export default {
  name: 'Export',
  data () {
    return {
    }
  },
  mounted () {

  },
  computed: {
    project () {
      return this.$store.state.projects.current
    },
    sites () {
      return this.$store.state.projects.sites.sites
    },
    paths () {
      return this.$store.state.projects.paths.paths
    },
    getGeoJSON () {
      let data3 = []
      for (var idxSite in this.sites) {
        let s = this.sites[idxSite]
        data3.push({'lat': s.latitude, 'lng': s.longitude, 'type': s.type, 'status': s.status, 'name': s.name})
      }

      for (let idxPaths in this.paths) {
        let p = this.paths[idxPaths]
        let pLine = []
        let intermedial
        try {
          intermedial = JSON.parse(p.intermedial) // We need to parse intermedial
        } catch (error) {
          console.log(error)
        }
        for (let idxPolyline in intermedial) {
          let latlng = intermedial[idxPolyline]
          pLine.push([ latlng.lng, latlng.lat ])
        }

        pLine.unshift([p.first.longitude, p.first.latitude]) // We put in front of the array the first site
        pLine.push([p.last.longitude, p.last.latitude]) // We put in front of the array the last site

        data3.push({'polyline': pLine, 'type': p.type, 'name': p.name})
      }

      return 'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(
          GeoJSON.parse(data3, {'Point': ['lat', 'lng'], 'LineString': 'polyline'}), null, 4))
    }
  },
  methods: {

  }
}
</script>
