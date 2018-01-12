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
      // console.log(JSON.stringify(id))
      // let item = this.projects.find(item => item.id === id)
      let item = this.projects[index]
      // console.log(JSON.stringify(item))
      //this.deactivateCurrentProject(index)
      //this.$set(item, 'activated', true)
      // this.projects[item.id].activated = true
      this.current = item.id
    },
    deactivateCurrentProject (index) {
      /*let item = this.projects[index]
      // let item = this.projects.find(item => item.id === this.current)
      if (item) this.$set(item, 'activated', false)*/
    }
  }
}
</script>
