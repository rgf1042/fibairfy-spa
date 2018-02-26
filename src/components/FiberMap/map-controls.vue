<template>
  <b-container>
    <b-row align-h="center">
      <b-button-toolbar key-nav  aria-label="Toolbar for map controlling" align-h="center" class="pt-1">
        <b-input-group class="mx-1" prepend="Layer:">
          <b-input-group-append>
            <b-button variant="primary" :disabled="this.isCivil" @click="setLayer('civil', $event)">Cívil</b-button>
            <b-button variant="primary" :disabled="!this.isCivil" @click="setLayer('infra', $event)">Xarxa</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-input-group class="mx-1" prepend="Obra Civil:" v-if="this.isCivil">
          <b-input-group-append>
            <b-button :pressed="this.status === 'site'" @click="setStatus('site', $event)">Crea Site</b-button>
            <b-button :pressed="this.status === 'path'" @click="setStatus('path', $event)">Crea Tram</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-input-group class="mx-1" prepend="Infraestructura xarxa:" v-if="!this.isCivil">
          <b-input-group-append>
            <b-button :pressed="this.status === 'box'" @click="setStatus('box', $event)">Crea Box</b-button>
            <b-button :pressed="this.status === 'fiber'" @click="setStatus('fiber', $event)">Crea Fibra</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-button variant="info "v-if="this.status" @click="resetStatus($event)"><div v-html="octicons['arrow-left'].toSVG()"></div></b-button>
      </b-button-toolbar>
    </b-row>
  </b-container>
</template>
<script>
import octicons from 'octicons'

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
      octicons: octicons
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
    },
    resetStatus (evt) {
      evt.preventDefault()
      this.$emit('set-status', '')
    }
  }
}
</script>
