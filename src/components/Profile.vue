<template>
  <b-container>
    <h2>{{user.name}}</h2>
    <b-form @submit="onSubmit">
      <b-form-group id="langInputGroup"
                    label="Idioma:"
                    label-for="langInput">
        <b-form-select id="langInput" v-model="form.locale" :options="langList" class="mb-3" />
      </b-form-group>
      <b-button type="submit" variant="primary">Actualitzar</b-button>
    </b-form>
  </b-container>
</template>
<script>
export default {
  name: 'Profile',
  data () {
    return {
      form: {
        locale: this.$store.state.user.locale
      }
    }
  },
  mounted () {

  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    langList () {
      return Object.keys(this.$i18n.messages)
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.$i18n.locale = this.form.locale
      this.$store.dispatch('user/changeLocale', this.form.locale)
    }
  }
}
</script>
