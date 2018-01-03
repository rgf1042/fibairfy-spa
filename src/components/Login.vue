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
      <b-col cols="4" class="pt-4">
        <h1>fiberfy</h1>
      </b-col>
    </b-row>
      <b-form @submit="onSubmit" v-if="show">
        <b-form-group id="usernameInputGroup"
                      label="Username:"
                      label-for="usernameInput">
          <b-form-input id="usernameInput"
                        type="text"
                        v-model="form.username"
                        required
                        placeholder="Enter username">
          </b-form-input>
        </b-form-group>
        <b-form-group id="passwordInputGroup"
                      label="Password:"
                      label-for="passwordInput">
          <b-form-input id="passwordInput"
                        type="password"
                        v-model="form.password"
                        required
                        placeholder="Enter password">
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
  </b-container>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      alert: {
        show: false,
        message: ''
      },
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.$store.dispatch('user/login', this.form).then(response => {
        this.$router.push('Map')
      }, error => {
        if (error.body.message) {
          this.alert.message = error.body.message
          this.alert.show = true
        }
      })
    }
  }
}
</script>
