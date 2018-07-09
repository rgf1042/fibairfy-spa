<template>
  <b-button-group>
    <b-button variant="success" :disabled="this.isActivated" v-on:click="activate">{{$t('components.projects.projectButtons.activate')}}</b-button>
    <b-button variant="info" :disabled="!this.isActivated" v-on:click="savePos">{{$t('components.projects.projectButtons.savePos')}}</b-button>
    <b-button variant="primary" v-if="this.isActivated" :to="{ name: 'ProjectEdit'}">{{$t('general.edit')}}</b-button>
    <b-button variant="danger" :disabled="this.isActivated" v-on:click="del">{{$t('components.projects.projectButtons.delete')}}</b-button>
  </b-button-group>
</template>
<script>
export default {
  name: 'project-buttons',
  props: ['projectId', 'current'],
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
      this.$emit('activate-project', Number(this.project.id))
    },
    savePos (evt) {
      evt.preventDefault()
      this.$emit('save-pos')
    },
    del (evt) {
      evt.preventDefault()
      this.$emit('delete-project', Number(this.project.id))
    }
  }
}
</script>
