<template>
  <div>
    <b-modal id="modal-delete-fiber" ref="deleteModalRef"
      @ok="deleteFiber"
      @cancel="noDeleteFiber"
      @esc="noDeleteFiber"
      @backdrop="noDeleteFiber"
      @headerclose="noDeleteFiber"
      title="Esborrar fibra">
      <p class="my-4">Segur que vol esborrar la fibra: {{deleted.name}}</p>
    </b-modal>
    <b-col>
      <b-input-group :prepend="form.id">
        <b-form-input type="text" v-model="form.color"></b-form-input>
        <b-input-group-append>
          <b-btn variant="danger" @click="onDelete">{{$t('general.delete')}}</b-btn>
        </b-input-group-append>
      </b-input-group>
    </b-col>
  </div>
</template>
<script>
import FiberfyAutocomplete from '@/components/shared/fiberfy-autocomplete'

export default {
  name: 'fiber-edit',
  props: ['id', 'tube'],
  components: {
    'fiberfy-autocomplete': FiberfyAutocomplete
  },
  data () {
    return {
      form: {
        id: null,
        color: null,
        project: this.$store.state.projects.current.id,
        tube: this.tube
      },
      deleted: {
        id: 0
      }
    }
  },
  mounted () {
    let tub = this.$store.state.projects.fibers.fibers[this.id]
    if (tub) {
      this.form.id = tub.id
      this.form.color = tub.color
    }
    this.$bus.$once('update-cable', this.onSubmit)
  },
  computed: {

  },
  methods: {
    onSubmit () {
      if (this.form.id) {
        this.$store.dispatch('projects/updateFiber', this.form).then(response => {
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
    noDeleteFiber () {
      this.deleted = {}
      this.$refs.deleteModalRef.hide()
    },
    deleteFiber () {
      this.$bus.$off('update-cable', this.onSubmit)
      if (this.deleted.id) {
        this.$store.dispatch('projects/deleteFiber', this.deleted.id).then(response => {
          this.deleted = {} // Esborrem referencia
        }, error => {
          console.log(error)
        })
      }
    }
  }
}
</script>
