<template>
  <b-container>
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
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.$http.post('http://localhost:1337/auth/login', this.form).then(response => {
        // success callback
        alert(JSON.stringify(response))
      }, response => {
        // error callback
        alert(JSON.stringify(response))
      })
    }
  }
}
</script>
