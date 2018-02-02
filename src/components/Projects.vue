<template>
  <b-container fluid>
  <div>
  <!-- Modal Component -->
  <b-modal id="modal-delete-project" ref="deleteModalRef"
    @ok="deleteProject"
    @cancel="noDeleteProject"
    @esc="noDeleteProject"
    @backdrop="noDeleteProject"
    @headerclose="noDeleteProject"
    title="Esborrar projecte">
    <p class="my-4">Segur que vol esborrar el projecte: {{deleted.name}}</p>
  </b-modal>
  </div>
    <b-row>
      <b-col sm="2" class="pt-2">
        <p>Projects</p>
      </b-col>
    </b-row>
    <b-row v-for="(project, index) in list" :key="project.id" v-if="list">
      <b-col sm="2">
        <span>{{project.name}}</span>
        <span v-if="!project.writable">(Només lectura)</span>
      </b-col>
      <b-col sm="4">
        <project-buttons v-on:activate-project="activateProject(index)"
          v-on:save-pos="savePos"
          v-on:delete-project="questionDeleteProject($event)"
          :projectId="project.id" :current="current">
        </project-buttons>
      </b-col>
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
  data () {
    return {
      deleted: {
        id: 0
      }
    }
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
    savePos () {
      this.$store.dispatch('projects/savePos').then(response => {
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
    },
    questionDeleteProject (id) {
      this.$store.dispatch('projects/findProjectById', id).then(response => {
        let project = response
        this.deleted = project // Marquem id a esborrar
        this.$refs.deleteModalRef.show()
      })
    },
    noDeleteProject () {
      this.deleted = {}
      this.$refs.deleteModalRef.hide()
    },
    deleteProject () {
      this.$store.dispatch('projects/deleteProject', this.deleted.id).then(response => {
        this.deleted = {} // Esborrem referencia
      }, error => {
        console.log(error)
      })
    }
  }
}
</script>
