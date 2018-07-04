<template>
  <div>
    <b-modal id="modal-delete-fusion" ref="deleteModalRef"
      @ok="deleteFusion"
      @cancel="noDeleteFusion"
      @esc="noDeleteFusion"
      @backdrop="noDeleteFusion"
      @headerclose="noDeleteFusion"
      title="Esborrar fusió">
      <p class="my-4">Segur que vol esborrar la fusió: {{id}}</p>
    </b-modal>
    <b-form-select id="fusionInput" v-model="select" :options="options" class="mb-3" :disabled="(select !== null)"/>
    <b-button variant="danger" v-on:click="onDelete" v-if="select">{{$t('general.delete')}}</b-button>
  </div>
</template>
<script>
export default {
  name: 'fusion-fibers',
  props: ['id', 'type', 'in', 'out'],
  data () {
    return {
      deleted: null
    }
  },
  mounted () {
    if (this.type === 'fiber') {
    }
  },
  computed: {
    select: {
      get: function () {
        let fusion
        if (this.type === 'fiber') {
          fusion = this.$store.getters['projects/getFusionByFiber'](this.id)
        } else if (this.type === 'box') {
          fusion = this.$store.getters['projects/getFusionByBox']({id: this.id, in: this.in, out: this.out})
        }
        if (fusion) {
          return fusion
        } else {
          return null
        }
      },
      // setter
      set: function (value) {
        if (!value) return null
        if (this.select !== value) {
          let fusion = {
            fdata: {
              id: this.id,
              type: this.type
            },
            sdata: {
              id: value.id,
              type: value.type
            }
          }
          if (this.type === 'box') {
            fusion.fdata.in = this.in
            fusion.fdata.out = this.out
          }
          if (value.type === 'box') {
            fusion.sdata.in = value.in
            fusion.sdata.out = value.out
          }
          this.$store.dispatch('projects/addNewFusion', fusion)
        }
      }
    },
    options () {
      let data = {}
      if (this.type === 'box') {
        data.box = {}
        data.box.id = this.id
        data.box.in = this.in
        data.box.out = this.out
      } else {
        data.fiber = {}
        data.fiber.id = this.id
      }
      let output = this.$store.getters['projects/getPossibleFusions'](data)
      let boxes = output.boxes
      let result = []
      for (let key in boxes) {
        if (boxes.hasOwnProperty(key)) {
          for (let x in boxes[key].inputs) { // For evry input
            let item = {}
            item.value = {
              type: 'box',
              id: boxes[key].id,
              in: boxes[key].inputs[x]
            }
            item.text = 'Box- .' + boxes[key].id + '.input' + boxes[key].inputs[x]
            result.push(item)
          }
          for (let x in boxes[key].outputs) { // For evry output
            let item = {}
            item.value = {
              type: 'box',
              id: boxes[key].id,
              out: boxes[key].outputs[x]
            }
            item.text = 'Box- .' + boxes[key].id + '.output' + boxes[key].outputs[x]
            result.push(item)
          }
        }
      }
      let fibers = output.fibers
      for (let key in fibers) {
        if (fibers.hasOwnProperty(key)) {
          let item = {}
          item.value = {
            type: 'fiber',
            id: fibers[key].id
          }
          item.text = 'Fiber- .' + fibers[key].id
          result.push(item)
        }
      }
      return result
    }
  },
  methods: {
    onDelete (evt) {
      evt.preventDefault()
      this.$refs.deleteModalRef.show()
    },
    noDeleteFusion () {
      this.$refs.deleteModalRef.hide()
    },
    deleteFusion () {
      let fusion = {}
      fusion.fdata = {
        id: this.id,
        type: this.type,
        in: this.in,
        out: this.out
      }
      fusion.sdata = {
        id: this.select.id,
        type: this.select.type,
        in: this.select.in,
        out: this.select.out
      }
      this.$store.dispatch('projects/deleteFusion', fusion).then(response => {

      }, error => {
        console.log(error)
      })
    }
  }
}
</script>
