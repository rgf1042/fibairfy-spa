<template>
  <div>
    <b-modal id="modal-delete-cable" ref="deleteModalRef"
      @ok="deleteCable"
      @cancel="noDeleteCable"
      @esc="noDeleteCable"
      @backdrop="noDeleteCable"
      @headerclose="noDeleteCable"
      title="Esborrar cable">
      <p class="my-4">Segur que vol esborrar el cable: {{deleted.name}}</p>
    </b-modal>
    <b-modal id="modal-template-change" ref="changeModalRef"
      @ok="onChange"
      title="Template cable">
      <p class="my-4">Segur que vol canviar la template? Es perdran tots els tubs i fibres.</p>
    </b-modal>
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
          <h2>Editar cable: {{form.id}}</h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col><hr></b-col>
      </b-row>
        <b-form>
          <b-form-group id="nameInputGroup"
                        label="Nom:"
                        label-for="nameInput">
            <b-form-input id="nameInput"
                          type="text"
                          v-model="form.name"
                          required
                          placeholder="Enter name">
            </b-form-input>
          </b-form-group>
          <b-form-group id="statusInputGroup"
                        :label="this.$t('general.status')+':'"
                        label-for="statusInput">
            <b-form-select id="statusInput" v-model="form.status" :options="statusList" class="mb-3" />
          </b-form-group>
          <b-form-group id="observationsInputGroup"
                        label="Observacions:"
                        label-for="observationsInput">
            <b-form-textarea id="observationsInput"
                       v-model="form.observations"
                       placeholder="Observacions"
                       :rows="3"
                       :max-rows="6">
            </b-form-textarea>
          </b-form-group>
          <b-form-group id="templateInputGroup"
                        label="Template:"
                        label-for="templateInput">
            <b-form-select id="templateInput" v-model="template"
                :disabled="!this.current.writable" :options="templates" class="mb-3" />
          </b-form-group>
        </b-form>

        <b-row class="pt-2">
          <b-col cols="10">
            <h2>Editar tubs: {{form.id}}</h2>
          </b-col>
          <b-col>
            <b-button type="button" variant="success"
                  :disabled="!this.current.writable" @click="addTube">{{$t('general.add')}}</b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col><hr></b-col>
        </b-row>
        <div v-for="(tubeId, index) in tubes" :key="tubeId">
          <tube-edit :id="tubeId"></tube-edit>
        </div>
        <b-row class="pt-4">
          <b-button class="mr-1" type="button" variant="primary" :disabled="!this.current.writable" @click="onSubmit">{{$t('general.update')}}</b-button>
          <b-button class="mr-1" type="button" variant="danger" :disabled="!this.current.writable" @click="onDelete">{{$t('general.delete')}}</b-button>
        </b-row>
    </b-container>
  </div>
</template>
<script>
import FiberfyAutocomplete from '@/components/shared/fiberfy-autocomplete'
import TubeEdit from '@/components/CableEdit/tube-edit'

export default {
  name: 'CableEdit',
  components: {
    'fiberfy-autocomplete': FiberfyAutocomplete,
    'tube-edit': TubeEdit
  },
  data () {
    return {
      form: {
        id: 0,
        name: '',
        status: '',
        observations: ''
      },
      template: 0,
      alert: {
        show: false,
        message: ''
      },
      deleted: {
        id: 0
      }
    }
  },
  mounted () {
    let cable = this.$store.getters['projects/findCableById'](this.$route.params.id)
    if (cable) {
      this.form.id = cable.id
      this.form.name = cable.name
      this.form.status = cable.status
      this.form.observations = cable.observations
    } else {
      this.alert.message = 'No existeix' // TODO: Make lang templates
      this.alert.show = true
      console.log(this.alert.message)
    }
  },
  computed: {
    templates () {
      let output = []
      let templates = this.$store.state.templates.fiberTemplates
      for (let x in templates) {
        output[x] = {
          value: templates[x].id,
          text: templates[x].name
        }
      }
      return output
    },
    tubes () {
      return this.$store.getters['projects/tubesIndexes'](this.form.id)
    },
    statusList () {
      let output = []
      let statusList = this.$store.state.templates.statusList
      for (let x in statusList) {
        output[x] = {
          value: statusList[x],
          text: this.$t('general.statusList.' + statusList[x])
        }
      }
      return output
    },
    current () {
      return this.$store.getters['projects/current']
    }
  },
  watch: {
    template: function (newVal, oldVal) {
      this.$refs.changeModalRef.show()
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.$bus.$emit('update-cable')
      this.$store.dispatch('projects/updateCable', this.form).then(response => {
        this.$router.go(-1)
      }, error => {
        this.alert.message = error.msg
        this.alert.show = true
        console.log(error)
      })
    },
    onDelete (evt) {
      evt.preventDefault()
      this.deleted = this.form
      this.$refs.deleteModalRef.show()
    },
    noDeleteCable () {
      this.deleted = {}
      this.$refs.deleteModalRef.hide()
    },
    deleteCable () {
      this.$store.dispatch('projects/deleteCable', this.deleted.id).then(response => {
        this.deleted = {} // Esborrem referencia
        this.$router.go(-1)
      }, error => {
        this.alert.message = error.msg
        this.alert.show = true
        this.deleted = {} // Esborrem referencia
        console.log(error)
      })
    },
    addTube (evt) {
      evt.preventDefault()
      let tube = {
        cable: this.form.id,
        project: this.$store.state.projects.current.id
      }
      this.$store.dispatch('projects/addNewTube', tube).then(response => {
      }, error => {
        this.alert.message = error.msg
        this.alert.show = true
        console.log(error)
      })
    },
    onChange () {
      console.log('on change')
      let data = {
        cable: this.form.id,
        template: this.template
      }
      this.$store.dispatch('projects/setCableTemplate', data).then(response => {
      }, error => {
        this.alert.message = error.msg
        this.alert.show = true
        console.log(error)
      })
    },
    onClear (evt) {
      evt.preventDefault()
      this.$store.dispatch('projects/clearTubesCable', this.form.id).then(response => {
      }, error => {
        this.alert.message = error.msg
        this.alert.show = true
        console.log(error)
      })
    }
  }
}
</script>
