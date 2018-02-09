<template>
  <b-container>
    <h3>{{user.name}}</h3>
  </b-container>
</template>
<script>
export default {
  name: 'Profile',
  data () {
    return {
    }
  },
  mounted () {

  },
  computed: {
    user () {
      return this.$store.state.user.user
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
    }
  }
}
</script>
