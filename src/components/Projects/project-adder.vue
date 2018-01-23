<template>
  <b-row class="my-1">
    <b-col sm="2"><label>Afegir projecte:</label></b-col>
    <b-col sm="4"><b-form-input v-model="name" type="text"></b-form-input></b-col>
    <b-col sm="2"><b-button type="button" variant="primary" v-on:click="add">Afegir</b-button></b-col>
  </b-row>
</template>
<script>
export default {
  name: 'project-adder',
  data () {
    return {
      name: ''
    }
  },
  methods: {
    add (evt) {
      evt.preventDefault()
      this.$emit('add-project', this.name)
      this.name = ''
    }
  }
}
</script>
