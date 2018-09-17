<template>
  <div>
    <b-container>
      <b-row>
        <b-col class="pt-1">
          <b-alert :variant="alert.type"
               dismissible
               :show="alert.show"
               @dismissed="alert.show=false">
                {{alert.message}}
          </b-alert>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col cols="10">
          <h2>{{$tc('components.editBoxes.title', 2)}}: {{id}}</h2>
        </b-col>
        <b-col>
          <b-button variant="success" v-on:click="addBox">{{$t('general.add')}}</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col><hr></b-col>
      </b-row>
      <b-row class="pt-2" v-for="boxId in boxesIds" :key="boxId">
        <b-col>
          <box-edit :id="boxId"></box-edit>
        </b-col>
      </b-row>
      <b-row class="pt-4">
        <b-button class="mr-1" type="button" variant="primary" @click="onSubmit">{{$t('general.update')}}</b-button>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import BoxEdit from '@/components/BoxesEdit/box-edit'
import uuidv1 from 'uuid/v1'

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
        type: 'danger',
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
    this.$bus.$on('notification-boxes', this.onNotification)
  },
  destroyed () {
    this.$bus.$off('notification-boxes', this.onNotification)
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
      box.name = 'box-' + uuidv1()
      box.type = 'splitter'
      box.site = this.id
      box.status = 'Planned'
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
      this.$bus.$emit('update-boxes')
      this.$router.go(-1)
    },
    onNotification (type, message) {
      this.alert.type = type
      this.alert.message = message
      this.alert.show = true
    }
  }
}
</script>
