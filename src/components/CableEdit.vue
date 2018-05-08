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
          <h3>Editar cable: {{form.id}}</h3>
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
          <b-button type="submit" variant="primary">Actualitzar</b-button>
          <b-button type="button" variant="danger" @click="onDelete">Eliminar</b-button>
        </b-form>
    </b-container>
  </div>
</template>
<script>
import FiberfyAutocomplete from '@/components/shared/fiberfy-autocomplete'

export default {
  name: 'CableEdit',
  components: {
    'fiberfy-autocomplete': FiberfyAutocomplete
  },
  data () {
    return {
      form: {
        id: 0,
        name: '',
        observations: ''
      },
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
      this.form.observations = cable.observations
    } else {
      this.alert.message = 'No existeix' // TODO: Make lang templates
      this.alert.show = true
      console.log(this.alert.message)
    }
  },
  computed: {

  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
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
    }
  }
}
</script>
