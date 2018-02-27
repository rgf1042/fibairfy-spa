<template>
  <b-container>
    <!-- Modal Component -->
    <b-modal id="modal-change-menu" ref="changeMenuModalRef"
      @ok="changeMenu(newMenu)"
      @cancel="noChangeMenu"
      @esc="noChangeMenu"
      @backdrop="noChangeMenu"
      @headerclose="noChangeMenu"
      title="Path en construcció">
      <p class="my-4">Actualment hi ha un path en construcció, segur que vol canviar el menú?</p>
    </b-modal>
    <b-row align-h="center">
      <b-button-toolbar key-nav  aria-label="Toolbar for map controlling" align-h="center" class="pt-1">
        <b-input-group class="mx-1" :prepend="this.$t('components.map.layerMenu.name')">
          <b-input-group-append>
            <b-button variant="primary" :disabled="this.isCivil" @click="testActive({ layer: 'civil'}, $event)">{{$t('components.map.layerMenu.civil')}}</b-button>
            <b-button variant="primary" :disabled="!this.isCivil" @click="testActive({ layer: 'infra'}, $event)">{{$t('components.map.layerMenu.network')}}</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-input-group class="mx-1" :prepend="this.$t('components.map.civilMenu.name')" v-if="this.isCivil">
          <b-input-group-append>
            <b-button :pressed="this.status === 'site'" @click="testActive({ status: 'site'}, $event)">{{$t('components.map.civilMenu.newSite')}}</b-button>
            <b-button :pressed="this.status === 'path'" @click="testActive({ status: 'path'}, $event)">{{$t('components.map.civilMenu.newPath')}}</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-input-group class="mx-1" :prepend="this.$t('components.map.networkMenu.name')" v-if="!this.isCivil">
          <b-input-group-append>
            <b-button :pressed="this.status === 'box'" @click="testActive({ status: 'box'}, $event)">{{$t('components.map.networkMenu.newBox')}}</b-button>
            <b-button :pressed="this.status === 'fiber'" @click="testActive({ status: 'fiber'}, $event)">{{$t('components.map.networkMenu.newFiber')}}</b-button>
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
  props: ['status', 'layerActive', 'activePath'],
  computed: {
    isCivil: function () {
      return (this.layerActive === 'civil')
    }
  },
  data () {
    return {
      octicons: octicons,
      newMenu: {}
    }
  },
  methods: {
    testActive (newMenu, evt) {
      evt.preventDefault()
      if (this.activePath) {
        this.newMenu = newMenu
        this.$refs.changeMenuModalRef.show()
      } else {
        this.changeMenu(newMenu)
      }
    },
    changeMenu (newMenu) {
      if (newMenu.layer) {
        // setLayer
        this.setLayer(newMenu.layer)
      }
      if (newMenu.status) {
        // setStatus
        this.setStatus(newMenu.status)
      }
    },
    noChangeMenu () {
      this.newMenu = {}
      this.$refs.changeMenuModalRef.hide()
    },
    setStatus (status) {
      if (this.status === status) {
        this.$emit('set-status', '')
      } else {
        this.$emit('set-status', status)
      }
    },
    setLayer (layer) {
      this.$emit('set-layer', layer)
    },
    resetStatus (evt) {
      this.$emit('set-status', '')
    }
  }
}
</script>
