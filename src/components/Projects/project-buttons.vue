<template>
  <b-button-group>
    <b-button variant="success" :disabled="this.isActivated" v-on:click="activate">Activar</b-button>
    <b-button variant="info" :disabled="!this.isActivated" v-on:click="savePos">Guardar Pos.</b-button>
    <b-button variant="danger" :disabled="this.isActivated">Eliminar</b-button>
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
    }
  }
}
</script>
