<template>
  <div>
    <b-container>
      <b-row>
        <b-col class="pt-1">
          <b-alert variant="danger"
               dismissible
               :show="alert.show"
               @dismissed="alert.show=false">
                {{alert.message}}
          </b-alert>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4" class="pt-2">
          <h3>{{$tc('components.editFusions.title', 2)}}: {{id}}</h3>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col v-for="(cableId, index) in cables" :key="cableId">
          <fusion-cables :id="cableId"></fusion-cables>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col v-for="(boxId, index) in boxes" :key="boxId">
          <fusion-boxes :id="boxId"></fusion-boxes>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import FusionCables from './FusionsEdit/fusion-cables'
import FusionBoxes from './FusionsEdit/fusion-boxes'

export default {
  name: 'FusionsEdit',
  components: {
    'fusion-cables': FusionCables,
    'fusion-boxes': FusionBoxes
  },
  data () {
    return {
      id: this.$route.params.id,
      name: null,
      alert: {
        show: false,
        message: ''
      }
    }
  },
  created () {
  },
  computed: {
    cables () {
      return this.$store.getters['projects/cablesIndexes'](this.id)
    },
    boxes () {
      return this.$store.getters['projects/boxesIndexes'](this.id)
    }
  },
  methods: {
    goFusionsShow (evt) {
      evt.preventDefault()
      this.$router.push({name: 'FusionsShow', params: { id: this.id }})
    }
  }
}
</script>
