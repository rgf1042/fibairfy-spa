<template>
  <div>
    <canvas id="canvasFusions"></canvas>
  </div>
</template>

<script>
/* eslint-disable */
import Pfusion from './FusionsShow/pfusion'
var fusions

export default {
  name: 'FusionsShow',
  components: {
  },
  data () {
    return {
      id: this.$route.params.id
    }
  },
  mounted () {
    this.$store.dispatch('projects/loadFusions', this.id).then(response => {
      fusions = new Pfusion('canvasFusions', this)
      fusions.draw()
    })
  },
  methods: {
  }
}
</script>
