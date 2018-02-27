<template>
  <b-row class="my-1">
    <b-col sm="2"><label>{{$t('components.projects.addProjectMenu.name')}}:</label></b-col>
    <b-col sm="4"><b-form-input v-model="name" type="text"></b-form-input></b-col>
    <b-col sm="2"><b-button type="button" variant="primary" v-on:click="add">{{$t('components.projects.addProjectMenu.addButton')}}</b-button></b-col>
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
