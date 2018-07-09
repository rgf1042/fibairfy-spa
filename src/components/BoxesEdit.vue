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
          <h3>{{$tc('components.editBoxes.title', 2)}}: {{id}}</h3>
        </b-col>
      </b-row>
      <b-row class="pt-2" v-for="boxId in boxesIds" :key="boxId">
        <b-col>
          <box-edit :id="boxId"></box-edit>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-button variant="success" v-on:click="addBox">{{$t('general.add')}}</b-button>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import BoxEdit from '@/components/BoxesEdit/box-edit'

export default {
  name: 'BoxesEdit',
  components: {
    'box-edit': BoxEdit
  },
  data () {
    return {
      id: 0,
      name: null,
      alert: {
        show: false,
        message: ''
      }
    }
  },
  mounted () {
    this.$store.dispatch('projects/findSiteById', parseInt(this.$route.params.id)).then(response => {
      let site = response
      this.id = site.id
      this.name = site.name
    }, error => {
      this.alert.message = error
      this.alert.show = true
      console.log(error)
    })
  },
  computed: {
    boxesIds () {
      return this.$store.getters['projects/boxesIndexes'](this.id)
    }
  },
  methods: {
    addBox (evt) {
      evt.preventDefault()
      let box = {}
      box.inputFO = 0
      box.outputFO = 0
      box.type = 'splitter'
      box.site = this.id
      box.project = this.$store.state.projects.current.id
      this.$store.dispatch('projects/addNewBox', box).then(response => {

      }, error => {
        this.alert.message = error.msg
        this.alert.show = true
        console.log(error)
      })
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.$store.dispatch('projects/updatePath', this.form).then(response => {
        this.$router.go(-1)
      }, error => {
        this.alert.message = error.msg
        this.alert.show = true
        console.log(error)
      })
    },
    goFusions (evt) {
      evt.preventDefault()
      this.$router.push({name: 'FusionsEdit', params: { id: this.id }})
      /* this.$store.dispatch('projects/loadFusions', this.id).then(response => {

      }) */
    }
  }
}
</script>
