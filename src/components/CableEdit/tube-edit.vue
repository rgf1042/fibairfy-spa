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
        <h4>{{$tc('components.editTubes.editTube.title', 1)}}: {{form.id}}</h4>
      </b-col>
      <b-col cols="1">
        <b-button type="button" variant="danger" @click="onDelete">{{$t('general.delete')}}</b-button>
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
    <b-row class="pt-2">
      <b-col cols="1"><label>Fibres:</label></b-col>
    </b-row>
    <b-row class="pt-2">
      <fiber-edit v-for="(fiberId, index) in fibers" :key="fiberId"
                  :id="fiberId" :tube="form.id"></fiber-edit>
      <b-col cols="1">
        <b-button type="button" variant="success"
                                @click="addFiber">{{$t('general.add')}}</b-button>
      </b-col>
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
        project: this.$store.state.projects.current.id,
        cable: this.cable
      },
      deleted: {
        id: 0
      }
    }
  },
  mounted () {
    let tub = this.$store.state.projects.tubes.tubes[this.id]
    if (tub) {
      this.form.id = tub.id
      this.form.color = tub.color
    }
    this.$bus.$once('update-cable', this.onSubmit)
  },
  computed: {
    fibers () {
      return this.$store.getters['projects/fibersIndexes'](this.form.id)
    }
  },
  methods: {
    onSubmit () {
      if (this.form.id) {
        this.$store.dispatch('projects/updateTube', this.form).then(response => {
        }, error => {
          console.log(error)
        })
      } else {
        this.$store.dispatch('projects/addNewTube', this.form).then(response => {
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
