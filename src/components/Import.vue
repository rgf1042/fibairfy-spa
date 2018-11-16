<template>
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
    <b-row class="pt-2">
      <b-col sm="2">
        <h2>{{$t('components.import.title')}}</h2>
      </b-col>
      <b-col sm="1">
        <spinner-loading :loading="loading"></spinner-loading>
      </b-col>
    </b-row>
    <b-form @submit="onSubmit">
      <b-form-group id="thresholdInputGroup"
                    :label="this.$t('components.import.threshold') + ':'"
                    label-for="thresholdInput">
        <b-form-input id="thresholdInput"
                      type="number"
                      :disabled="!project.id"
                      v-model="form.threshold"
                      required
                      placeholder="Enter threshold">
        </b-form-input>
      </b-form-group>
      <b-form-group id="zoneInputGroup"
                    :label="this.$t('general.zone')+':'"
                    label-for="zoneInput">
        <fiberfy-autocomplete type="remote"
                              :url="this.zoneUrl"
                              selectedField="title" returnedField="id"
                              :disabled="!project.id"
                              required="true"
                              v-model="form.defaultZone"/>
      </b-form-group>
      <b-form-group id="fileInputGroup"
                    :label="this.$t('general.file')+':'"
                    :disabled="!project.id"
                    label-for="fileInput">
        <b-form-file id="fileInput" :disabled="!project.id" v-model="form.data" plain></b-form-file>
      </b-form-group>
      <b-button type="submit" variant="primary" :disabled="!project.id">{{$t('general.import')}}</b-button>
    </b-form>
  </b-container>
</template>
<script>
import FiberfyAutocomplete from '@/components/shared/fiberfy-autocomplete'
import SpinnerLoading from '@/components/shared/spinner-loading'

export default {
  name: 'Import',
  components: {
    'fiberfy-autocomplete': FiberfyAutocomplete,
    'spinner-loading': SpinnerLoading
  },
  data () {
    return {
      form: {
        data: '',
        defaultZone: '',
        threshold: 10
      },
      alert: {
        show: false,
        message: ''
      },
      zoneUrl: fiberfy.constants.BASE_URL + fiberfy.constants.API_VERSION + '/zone/', // eslint-disable-line
      loading: false
    }
  },
  mounted () {
    this.form.defaultZone = this.project.defaultZone
  },
  computed: {
    project () {
      return this.$store.state.projects.current
    },
    pathTypes () {
      let output = []
      let types = this.$store.state.projects.paths.types
      for (let x in types) {
        output[x] = {
          value: types[x],
          text: this.$t('content.pathTypes.' + types[x])
        }
      }
      return output
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.loading = true
      this.$store.dispatch('projects/importProject', this.form).then(response => {
        this.loading = false
        this.$router.go(-1)
      }, error => {
        this.loading = false
        this.alert.message = error.body.msg
        this.alert.show = true
        console.log(error)
      })
    }
  }
}
</script>
