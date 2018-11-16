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
    <b-row class="pt-4">
      <b-col cols="2">
        <h1>fiberfy</h1>
      </b-col>
      <b-col cols="1">
        <spinner-loading :loading="loading"></spinner-loading>
      </b-col>
    </b-row>
    <b-form @submit="onSubmit">
      <b-form-group id="usernameInputGroup"
                    label="Username:"
                    label-for="usernameInput">
        <b-form-input id="usernameInput"
                      type="text"
                      v-model="form.username"
                      required
                      :disabled="loading"
                      placeholder="Enter username"
                      autofocus>
        </b-form-input>
      </b-form-group>
      <b-form-group id="passwordInputGroup"
                    label="Password:"
                    label-for="passwordInput">
        <b-form-input id="passwordInput"
                      type="password"
                      v-model="form.password"
                      :disabled="loading"
                      required
                      placeholder="Enter password">
        </b-form-input>
      </b-form-group>
      <b-form-group id="authInputGroup"
                    label="Autenticació:"
                    label-for="authInput">
        <b-form-select id="authInput" v-model="form.auth"
                      :disabled="loading"
                      :options="authTypes" class="mb-3" />
      </b-form-group>
      <b-button type="submit" variant="primary" :disabled="loading">Login</b-button>
    </b-form>
  </b-container>
</template>

<script>
import SpinnerLoading from '@/components/shared/spinner-loading'

export default {
  name: 'Login',
  components: {
    'spinner-loading': SpinnerLoading
  },
  data () {
    return {
      form: {
        auth: 'LDAP',
        username: '',
        password: ''
      },
      alert: {
        show: false,
        message: ''
      },
      authTypes: [
        'Local',
        'LDAP'
      ],
      loading: false
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.loading = true
      this.$store.dispatch('user/login', this.form).then(response => {
        this.$store.dispatch('projects/loadProjectsList').then(response => {
          this.loading = false
          this.$router.push({name: 'Map'})
        }, error => {
          this.loading = false
          if (error.body) {
            this.alert.message = error.body
            this.alert.show = true
          }
          this.form.auth = 'LDAP'
        })
      }, error => {
        this.loading = false
        if (error.body.message) {
          this.alert.message = error.body.message
          this.alert.show = true
        }
        this.form.auth = 'LDAP'
      })
    }
  }
}
</script>
