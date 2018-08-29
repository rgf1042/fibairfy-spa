<template>
  <b-container>
    <div>
    <!-- Modal Component -->
    <b-modal id="modal-delete-project" ref="deleteModalRef"
      @ok="deleteProject"
      @cancel="noDeleteProject"
      @esc="noDeleteProject"
      @backdrop="noDeleteProject"
      @headerclose="noDeleteProject"
      title="Esborrar projecte">
      <p class="my-4">Segur que vol esborrar el site: {{deleted.name}}</p>
    </b-modal>
    </div>
    <b-row>
      <b-col class="pt-1">
        <b-alert :variant="alert.variant"
             dismissible
             :show="alert.show"
             @dismissed="alert.show=false">
              {{alert.message}}
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="2" class="pt-2">
        <h3>{{$t('menu.projects')}}</h3>
      </b-col>
    </b-row>
    <b-row>
      <project-selected :loading="loading"></project-selected>
    </b-row>
    <b-row class="pt-2" v-for="(project, index) in list" :key="project.id" v-if="list">
      <b-col sm="2">
        <span>{{project.name}}</span>
        <span v-if="!project.writable">({{$t('components.projects.readonly')}})</span>
      </b-col>
      <b-col sm="4">
        <project-buttons :projectId="project.id" :current="current" :loading="loading">
        </project-buttons>
      </b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col sm="1">
        <b-button type="button" variant="primary"
          :to="{ name: 'ProjectAdd'}">
          {{$t('components.projects.projectAdd.name')}}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
/* eslint-disable */
import ProjectButtons from '@/components/Projects/project-buttons'
import ProjectSelected from '@/components/Projects/project-selected'

export default {
  name: 'Projects',
  components: {
    'project-buttons': ProjectButtons,
    'project-selected': ProjectSelected,
  },
  mounted () {
    this.$bus.$on('activate-project', this.activateProject)
    this.$bus.$on('deactivate-project', this.deactivateProject)
    this.$bus.$on('save-pos', this.savePos)
    this.$bus.$on('delete-project', this.questionDeleteProject)
  },
  destroyed () {
    this.$bus.$off('activate-project', this.activateProject)
    this.$bus.$off('deactivate-project', this.deactivateProject)
    this.$bus.$off('save-pos', this.savePos)
    this.$bus.$off('delete-project', this.questionDeleteProject)
  },
  data () {
    return {
      loading: false,
      deleted: {
        id: 0
      },
      alert: {
        show: false,
        message: '',
        variant: 'info'
      }
    }
  },
  computed: {
    current () {
      return this.$store.state.projects.current.id
    },
    list () {
      return this.$store.state.projects.list
    }
  },
  methods: {
    activateProject (id) {
      this.loading = true // We set to true loading data used in props communication
      this.$store.dispatch('projects/setCurrent', id).then(response => {
        this.loading = false
      }, error => {
        this.loading = false
        console.log(error)
        this.alert.message = error.body
        this.alert.variant = 'danger'
        this.alert.show = true
      })
    },
    deactivateProject () {
      this.$store.dispatch('projects/unsetCurrent')
    },
    savePos () {
      this.$store.dispatch('projects/savePos').then(response => {
        this.alert.message = 'New position correctly saved'
        this.alert.variant = 'info'
        this.alert.show = true
      }, error => {
        /* if (error.body.message) {
          this.alert.message = error.body.message
          this.alert.show = true
        } */
        console.log(error)
        this.alert.message = error.body
        this.alert.show = true
        this.alert.variant = 'danger'
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
        this.deleted = {} // Esborrem referencia
        console.log(error)
        this.alert.message = error.body
        this.alert.variant = 'danger'
        this.alert.show = true
      })
    }
  }
}
</script>
