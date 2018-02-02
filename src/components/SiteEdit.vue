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
    <b-row>
      <b-col cols="4" class="pt-2">
        <h3>Editar site: {{id}}</h3>
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
        <b-form-group id="typeInputGroup"
                      label="Tipus:"
                      label-for="typeInput">
          <b-form-select id="typeInput" v-model="form.typeSelected" :options="types" class="mb-3" />
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
        <b-button type="button" variant="danger">Eliminar</b-button>
      </b-form>
  </b-container>
</template>
<script>
export default {
  name: 'SiteEdit',
  data () {
    return {
      id: 0,
      form: {
        name: '',
        typeSelected: '',
        observations: ''
      },
      alert: {
        show: false,
        message: ''
      }
    }
  },
  mounted () {
    this.$store.dispatch('projects/findSiteById', this.$route.params.id).then(response => {
      let site = response
      this.id = site.id
      this.form.name = site.name
      this.form.typeSelected = site.type
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
    }
  }
}
</script>
