<template>
  <div>
    <b-modal id="modal-delete-site" ref="deleteModalRef"
      @ok="deleteBox"
      @cancel="noDeleteBox"
      @esc="noDeleteBox"
      @backdrop="noDeleteBox"
      @headerclose="noDeleteBox"
      title="Esborrar box">
      <p class="my-4">Segur que vol esborrar el box: {{deleted.name}}</p>
    </b-modal>
    <b-container>
      <b-row>
        <b-col cols="4" class="pt-2">
          <h3>{{$tc('components.editBoxes.editBox.title', 1)}}: {{form.id}}</h3>
        </b-col>
      </b-row>
        <b-form @submit="onSubmit">
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
          <b-form-group id="inputInputGroup"
                        label="Input:"
                        label-for="inputInput">
            <b-form-input id="inputInput"
                          type="number"
                          v-model="form.inputFO"
                          required
                          placeholder="Enter input">
            </b-form-input>
          </b-form-group>
          <b-form-group id="outputInputGroup"
                        label="output:"
                        label-for="outputInput">
            <b-form-input id="outputInput"
                          type="number"
                          v-model="form.outputFO"
                          required
                          placeholder="Enter output">
            </b-form-input>
          </b-form-group>
          <b-form-group id="typeInputGroup"
                        label="Tipus:"
                        label-for="typeInput">
            <b-form-select id="typeInput" v-model="form.type" :options="types" class="mb-3" />
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
          <b-button type="button" variant="danger" @click="onDelete">Eliminar</b-button>
        </b-form>
    </b-container>
  </div>
</template>
<script>
import FiberfyAutocomplete from '@/components/shared/fiberfy-autocomplete'

export default {
  name: 'box-edit',
  props: ['id'],
  components: {
    'fiberfy-autocomplete': FiberfyAutocomplete
  },
  data () {
    return {
      form: {
        id: 0,
        name: '',
        inputFO: 0,
        outputFO: 0,
        type: '',
        status: '',
        observations: ''
      },
      deleted: {
        id: 0
      }
    }
  },
  mounted () {
    let box = this.$store.state.projects.boxes.boxes[this.id]
    this.form.id = box.id
    this.form.name = box.name
    this.form.inputFO = box.inputFO
    this.form.outputFO = box.outputFO
    this.form.type = box.type
    this.form.status = box.status
    this.form.observations = box.observations
    this.$bus.$once('update-boxes', this.onSubmit)
  },
  computed: {
    types () {
      let output = []
      let types = this.$store.state.projects.boxes.types
      for (let x in types) {
        output[x] = {
          value: types[x],
          text: this.$t('content.boxTypes.' + types[x])
        }
      }
      return output
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
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('projects/updateBox', this.form).then(response => {
      }, error => {
        this.$bus.$emit('notification-boxes', 'danger', error.msg)
      })
    },
    onDelete (evt) {
      evt.preventDefault()
      this.deleted = this.form
      this.$refs.deleteModalRef.show()
    },
    noDeleteBox () {
      this.deleted = {}
      this.$refs.deleteModalRef.hide()
    },
    deleteBox () {
      this.$bus.$off('update-boxes', this.onSubmit)
      this.$store.dispatch('projects/deleteBox', this.deleted.id).then(response => {
        this.deleted = {} // Esborrem referencia
      }, error => {
        this.$bus.$emit('notification-boxes', 'danger', error.msg)
      })
    }
  }
}
</script>
