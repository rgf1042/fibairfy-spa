<template>
  <b-container>
    <b-button-group>
      <b-button variant="info" :disabled="this.isCivil" @click="setLayer('civil', $event)">Cívil</b-button>
      <b-button variant="info" :disabled="!this.isCivil" @click="setLayer('infra', $event)">Xarxa</b-button>
    </b-button-group>
    <b-button-group v-if="this.isCivil">
      <b-button variant="info" :pressed="this.status === 'site'" @click="setStatus('site', $event)">Crea Site</b-button>
      <b-button variant="info" :pressed="this.status === 'path'" @click="setStatus('path', $event)">Crea Tram</b-button>
    </b-button-group>
    <b-button-group v-if="!this.isCivil">
      <b-button variant="info" :pressed="this.status === 'box'" @click="setStatus('box', $event)">Crea Box</b-button>
      <b-button variant="info" :pressed="this.status === 'fiber'" @click="setStatus('fiber', $event)">Crea Fibra</b-button>
    </b-button-group>
  </b-container>
</template>
<script>
export default {
  name: 'map-controls',
  props: ['status', 'layerActive'],
  computed: {
    isCivil: function () {
      return (this.layerActive === 'civil')
    }
  },
  data () {
    return {

    }
  },
  methods: {
    setStatus (status, evt) {
      evt.preventDefault()
      if (this.status === status) {
        this.$emit('set-status', '')
      } else {
        this.$emit('set-status', status)
      }
    },
    setLayer (layer, evt) {
      evt.preventDefault()
      this.$emit('set-layer', layer)
    }
  }
}
</script>
