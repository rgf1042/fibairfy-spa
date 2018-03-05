<template>
  <div>
    <b-modal id="modal-delete-path" ref="deleteModalRef"
      @ok="deletePath"
      @cancel="noDeletePath"
      @esc="noDeletePath"
      @backdrop="noDeletePath"
      @headerclose="noDeletePath"
      title="Esborrar path">
      <p class="my-4">Segur que vol esborrar el path: {{deleted.name}}</p>
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
          <h3>Editar path: {{form.id}}</h3>
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
          <b-form-group id="iniSiteInputGroup"
                        label="Primer site:"
                        label-for="iniSiteInput">
            <b-form-input id="iniSiteInput"
                          type="text"
                          v-model="form.first"
                          required
                          placeholder="Enter site">
            </b-form-input>
          </b-form-group>
          <b-form-group id="lastSiteInputGroup"
                        label="Segon site:"
                        label-for="lastSiteInput">
            <b-form-input id="lastSiteInput"
                          type="text"
                          v-model="form.last"
                          required
                          placeholder="Enter site">
            </b-form-input>
          </b-form-group>
          <b-form-group id="typeInputGroup"
                        label="Tipus:"
                        label-for="typeInput">
            <b-form-select id="typeInput" v-model="form.type" :options="types" class="mb-3" />
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
export default {
  name: 'PathEdit',
  data () {
    return {
      form: {
        id: 0,
        name: '',
        first: 0,
        last: 0,
        type: '',
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
    this.$store.dispatch('projects/findPathById', this.$route.params.id).then(response => {
      let path = response
      this.form.id = path.id
      this.form.name = path.name
      this.form.first = path.first.id
      this.form.last = path.last.id
      this.form.type = path.type
      this.form.observations = path.observations
    }, error => {
      this.alert.message = error
      this.alert.show = true
      console.log(error)
    })
  },
  computed: {
    types () {
      return this.$store.state.projects.paths.types
    }
  },
  methods: {
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
    onDelete (evt) {
      evt.preventDefault()
      this.deleted = this.form
      this.$refs.deleteModalRef.show()
    },
    noDeletePath () {
      this.deleted = {}
      this.$refs.deleteModalRef.hide()
    },
    deletePath () {
      this.$store.dispatch('projects/deletePath', this.deleted.id).then(response => {
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
