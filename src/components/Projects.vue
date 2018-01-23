<template>
  <b-container fluid>
    <b-row>
      <b-col class="pt-2">
        <p>Projects</p>
      </b-col>
    </b-row>
    <b-row v-for="(project, index) in list" :key="project.id" v-if="list">
      <p>{{project.name}}</p>
      <project-buttons v-on:activate-project="activateProject(index)" :projectId="project.id" :current="current"></project-buttons>
    </b-row>
    <project-adder v-on:add-project="addProject($event)"></project-adder>
  </b-container>
</template>

<script>
/* eslint-disable */
import ProjectButtons from '@/components/Projects/project-buttons'
import ProjectAdder from '@/components/Projects/project-adder'

export default {
  name: 'Projects',
  components: {
    'project-buttons': ProjectButtons,
    'project-adder': ProjectAdder
  },
  mounted () {

  },
  computed: {
    current() {
      return this.$store.state.projects.current.id
    },
    list() {
      return this.$store.state.projects.list
    }
  },
  methods: {
    activateProject (index) {
      // let item = this.list[index]
      this.$store.dispatch('projects/setCurrent', this.$store.state.projects.list[index].id).then(response => {
      }, error => {
        /* if (error.body.message) {
          this.alert.message = error.body.message
          this.alert.show = true
        } */
        console.log(error)
      })
    },
    addProject (name) {
      this.$store.dispatch('projects/addNewProject', name).then(response => {
      }, error => {
        console.log(error)
      })
    }
  }
}
</script>
