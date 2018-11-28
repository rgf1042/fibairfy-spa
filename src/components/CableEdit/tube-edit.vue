<template>
  <div>
    <b-modal id="modal-delete-tube" ref="deleteModalRef"
      @ok="deleteTube"
      @cancel="noDeleteTube"
      @esc="noDeleteTube"
      @backdrop="noDeleteTube"
      @headerclose="noDeleteTube"
      title="Esborrar tub">
      <p class="my-4">Segur que vol esborrar el tub: {{deleted.name}}</p>
    </b-modal>
    <b-row class="pt-2">
      <b-col cols="3">
        <h3>{{$tc('components.editTubes.editTube.title', 1)}}: {{form.id}}</h3>
      </b-col>
      <b-col cols="1">
        <b-button type="button" variant="danger" :disabled="!this.current.writable"
            @click="onDelete">{{$t('general.delete')}}</b-button>
      </b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col cols="1"><label>Color:</label></b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col cols="5">
        <b-form-input id="colorInput"
                      type="text"
                      v-model="form.color"
                      required
                      placeholder="Enter color">
        </b-form-input>
      </b-col>
    </b-row>
    <b-row class="py-3">
      <b-col cols="3"><h4>Fibres:</h4></b-col>
      <b-col><b-button type="button" variant="success"
                  @click="addFiber" :disabled="!this.current.writable">{{$t('general.add')}}</b-button></b-col>
    </b-row>
    <b-row class="pt-2">
        <fiber-edit v-for="(fiberId, index) in fibers" :key="fiberId"
                    :id="fiberId" :tube="form.id"></fiber-edit>
    </b-row>
    <b-row class="pt-4">
      <b-col><hr></b-col>
    </b-row>
  </div>
</template>
<script>

import FiberfyAutocomplete from '@/components/shared/fiberfy-autocomplete'
import FiberEdit from './fiber-edit'

export default {
  name: 'tube-edit',
  props: ['id', 'cable'],
  components: {
    'fiberfy-autocomplete': FiberfyAutocomplete,
    'fiber-edit': FiberEdit
  },
  data () {
    return {
      form: {
        id: null,
        color: null,
        project: this.$store.state.projects.current.id
      },
      original: {
        color: null
      },
      changes: false,
      deleted: {
        id: 0
      }
    }
  },
  mounted () {
    let tube = this.$store.state.projects.tubes.tubes[this.id]
    if (tube) {
      this.form.id = tube.id
      this.form.color = tube.color
      this.original.color = tube.color
    }
    this.$bus.$once('update-cable', this.onSubmit)
  },
  computed: {
    fibers () {
      return this.$store.getters['projects/fibersIndexes'](this.form.id)
    },
    current () {
      return this.$store.getters['projects/current']
    }
  },
  watch: {
    'form.color': function (newVal, oldVal) { // watch it
      this.changes = (newVal !== this.original.color)
    }
  },
  methods: {
    onSubmit () {
      if (this.form.id && this.changes) {
        this.$store.dispatch('projects/updateTube', this.form).then(response => {
        }, error => {
          console.log(error)
        })
      }
    },
    onDelete (evt) {
      evt.preventDefault()
      this.deleted = this.form
      this.$refs.deleteModalRef.show()
    },
    noDeleteTube () {
      this.deleted = {}
      this.$refs.deleteModalRef.hide()
    },
    deleteTube () {
      this.$bus.$off('update-cable', this.onSubmit)
      if (this.deleted.id) {
        this.$store.dispatch('projects/deleteTube', this.deleted.id).then(response => {
          this.deleted = {} // Esborrem referencia
        }, error => {
          this.alert.message = error.msg
          this.alert.show = true
          this.deleted = {} // Esborrem referencia
          console.log(error)
        })
      } else {
        this.$emit('delete-tube')
      }
    },
    addFiber (evt) {
      evt.preventDefault()
      let fiber = {
        tube: this.form.id,
        project: this.$store.state.projects.current.id
      }
      this.$store.dispatch('projects/addNewFiber', fiber).then(response => {
      }, error => {
        this.alert.message = error.msg
        this.alert.show = true
        console.log(error)
      })
    }
  }
}
</script>
