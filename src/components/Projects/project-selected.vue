<template>
  <b-container>
    <b-card :header="this.$t('components.projects.projectSelected.title')"
            :title="this.name">
          <div v-if="this.current.id && !this.loading">
            <b-row>
              <b-col>
                <b-row>
                  <b-col cols="2">
                    <label>ID:</label>
                  </b-col>
                  <b-col cols="4">
                    <label>{{current.id}}</label>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="2">
                    <label>{{$t('general.status')}}:</label>
                  </b-col>
                  <b-col cols="4">
                    <label>{{status}}</label>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="2">
                    <label>{{$t('general.zone')}}:</label>
                  </b-col>
                  <b-col cols="4">
                    <label>{{current.defaultZone}}</label>
                  </b-col>
                </b-row>
              </b-col>
              <b-col>
                <!-- Here we will put the buttons-->
                <project-buttons :projectId="this.current.id" :current="this.current.id"></project-buttons>
              </b-col>
            </b-row>
          </div>
    </b-card>
  </b-container>
</template>
<script>
import ProjectButtons from '@/components/Projects/project-buttons'

export default {
  name: 'project-selected',
  components: {
    'project-buttons': ProjectButtons
  },
  props: {
    loading: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  computed: {
    name () {
      if (this.loading) return this.$t('general.loading') + '...'
      else return this.$store.state.projects.current.name || '---'
    },
    current () {
      return this.$store.state.projects.current
    },
    status () {
      return this.$t('general.statusList.' + this.current.status) || ''
    }
  },
  data () {
    return {
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>
