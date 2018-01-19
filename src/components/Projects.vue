<template>
  <b-container fluid>
    <b-row>
      <b-col class="pt-2">
        <p>Projects</p>
      </b-col>
    </b-row>
    <b-row v-for="(project, index) in projects" :key="project.id">
      <p>{{project.name}}</p>
      <project-buttons v-on:activate-project="activateProject(index)" :projectId="project.id" :current="current"></project-buttons>
    </b-row>
  </b-container>
</template>

<script>
/* eslint-disable */
import ProjectButtons from '@/components/Projects/project-buttons'

export default {
  name: 'Projects',
  components: {
    'project-buttons': ProjectButtons
  },
  data () {
    return {
      current: -1,
      projects: []
    }
  },
  mounted () {
    this.$http.get('http://localhost:1337/api/v1/project/').then(response => {
      // success callback
      /*for (let x in response.body) {
        this.projects.push(response.body[x])
        this.projects[x] = Object.assign({}, this.projects[x], {
          activated: false
        })
      }*/
      this.projects = response.body
    }, error => {
      // http failed, let the calling function know that action did not work out
    })
  },
  methods: {
    activateProject (index) {
      let item = this.projects[index]
      this.current = item.id
      this.$store.dispatch('projects/setCurrent', this.current).then(response => {
      }, error => {
        /* if (error.body.message) {
          this.alert.message = error.body.message
          this.alert.show = true
        } */
        console.log(error)
      })
    }
  }
}
</script>
