<template>
  <b-container>
    <b-row>
      <b-col sm="2" class="pt-2">
        <h2>{{$t('menu.export')}}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="1" class="pt-2">

      </b-col>
    </b-row>

    <b-button @click="getGeoJSON" :disabled="!project.id">{{$t('general.download')}}</b-button>
  </b-container>
</template>
<script>
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
    }
  },
  methods: {
    getGeoJSON () {
      this.$http.get(fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/export/' + this.project.id) // eslint-disable-line
        .then(response => {
          let data = 'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(response.body, null, 4))
          let link = document.createElement('a')
          link.href = data
          link.download = this.project.name + '.geojson'
          link.click()
        }, error => {
          console.log(error)
        })
    }
  }
}
</script>
