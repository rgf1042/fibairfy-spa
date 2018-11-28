<template>
  <b-button-group>
    <b-button variant="success" :disabled="this.loading" v-if="this.isActivated" v-on:click="deactivate">{{$t('components.projects.projectButtons.deactivate')}}</b-button>
    <b-button variant="success" :disabled="this.loading" v-if="!this.isActivated" v-on:click="activate">{{$t('components.projects.projectButtons.activate')}}</b-button>
    <b-button variant="info" :disabled="(!this.isActivated || this.loading) || !this.current.writable" v-on:click="savePos">{{$t('components.projects.projectButtons.savePos')}}</b-button>
    <b-button variant="primary" v-if="this.isActivated" :disabled="this.loading || !this.current.writable" :to="{ name: 'ProjectEdit'}">{{$t('general.edit')}}</b-button>
    <b-button variant="danger" :disabled="!this.project.writable" v-on:click="del">{{$t('components.projects.projectButtons.delete')}}</b-button>
  </b-button-group>
</template>
<script>
export default {
  name: 'project-buttons',
  props: {
    project: {
      type: Object
    },
    current: {
      type: Object
      /* default: function () {
        return {
          id: null,
          writable: null
        }
      } */
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
      return (this.project.id === this.current.id)
    },
    isWritable: function () {
      return (this.isActivated && this.current.writable)
    }
  },
  data () {
    return {

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
