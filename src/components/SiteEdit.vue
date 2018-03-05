<template>
  <div>
    <b-modal id="modal-delete-site" ref="deleteModalRef"
      @ok="deleteSite"
      @cancel="noDeleteSite"
      @esc="noDeleteSite"
      @backdrop="noDeleteSite"
      @headerclose="noDeleteSite"
      title="Esborrar site">
      <p class="my-4">Segur que vol esborrar el site: {{deleted.name}}</p>
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
          <h3>Editar site: {{form.id}}</h3>
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
          <b-form-group id="locationInputGroup"
                        label="Localització:"
                        label-for="latitudeInput">
            <b-form-input id="latitudeInput"
                          type="text"
                          v-model="form.latitude"
                          required
                          placeholder="Enter latitude">
            </b-form-input>
            <b-form-input id="longitudeInput"
                          type="text"
                          v-model="form.longitude"
                          required
                          placeholder="Enter longitude">
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
  name: 'SiteEdit',
  data () {
    return {
      form: {
        id: 0,
        name: '',
        latitude: '',
        longitude: '',
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
    this.$store.dispatch('projects/findSiteById', this.$route.params.id).then(response => {
      let site = response
      this.form.id = site.id
      this.form.name = site.name
      this.form.latitude = site.latitude
      this.form.longitude = site.longitude
      this.form.type = site.type
      this.form.observations = site.observations
    }, error => {
      this.alert.message = error
      this.alert.show = true
      console.log(error)
    })
  },
  computed: {
    types () {
      return this.$store.state.projects.sites.types
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.$store.dispatch('projects/updateSite', this.form).then(response => {
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
    noDeleteSite () {
      this.deleted = {}
      this.$refs.deleteModalRef.hide()
    },
    deleteSite () {
      this.$store.dispatch('projects/deleteSite', this.deleted.id).then(response => {
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
