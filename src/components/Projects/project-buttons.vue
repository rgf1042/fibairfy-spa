<template>
  <b-button-group>
    <b-button variant="success" :disabled="this.loading" v-if="this.isActivated" v-on:click="deactivate">{{$t('components.projects.projectButtons.deactivate')}}</b-button>
    <b-button variant="success" :disabled="this.loading" v-if="!this.isActivated" v-on:click="activate">{{$t('components.projects.projectButtons.activate')}}</b-button>
    <b-button variant="info" :disabled="!this.isActivated || this.loading" v-on:click="savePos">{{$t('components.projects.projectButtons.savePos')}}</b-button>
    <b-button variant="primary" v-if="this.isActivated" :disabled="this.loading" :to="{ name: 'ProjectEdit'}">{{$t('general.edit')}}</b-button>
    <b-button variant="danger" :disabled="this.isActivated || this.loading" v-on:click="del">{{$t('components.projects.projectButtons.delete')}}</b-button>
  </b-button-group>
</template>
<script>
export default {
  name: 'project-buttons',
  props: {
    projectId: {

    },
    current: {

    },
    loading: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  computed: {
    isActivated: function () {
      return (this.projectId === this.current)
    }
  },
  data () {
    return {
      project: {
        id: this.projectId
      }
    }
  },
  mounted () {

  },
  methods: {
    activate (evt) {
      evt.preventDefault()
      this.$bus.$emit('activate-project', Number(this.project.id))
    },
    deactivate (evt) {
      evt.preventDefault()
      this.$bus.$emit('deactivate-project', Number(this.project.id))
    },
    savePos (evt) {
      evt.preventDefault()
      this.$bus.$emit('save-pos')
    },
    del (evt) {
      evt.preventDefault()
      this.$bus.$emit('delete-project', Number(this.project.id))
    }
  }
}
</script>
