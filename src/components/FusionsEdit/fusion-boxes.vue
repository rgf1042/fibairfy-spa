<template>
  <div>
    <b-row>
      <b-col cols="3">
        <h4>Box: {{id}} - {{name}}</h4>
      </b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col cols="1"><label>Inputs:</label></b-col>
    </b-row>
    <b-row class="pt-1" v-for="i in inputFO" :key="i">
      <b-col>Input{{i}}</b-col>
      <b-col><fusion-fibers :id="id" :in="i" type="box"></fusion-fibers></b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col cols="1"><label>Outputs:</label></b-col>
    </b-row>
    <b-row class="pt-1" v-for="i in outputFO" :key="i+'-second'">
      <b-col>Output{{i}}</b-col>
      <b-col><fusion-fibers :id="id" :out="i" type="box"></fusion-fibers></b-col>
    </b-row>
  </div>
</template>
<script>
import FusionFibers from './fusion-fibers'

export default {
  name: 'fusion-boxes',
  props: ['id'],
  components: {
    'fusion-fibers': FusionFibers
  },
  data () {
    return {
      name: null,
      inputFO: null,
      outputFO: null
    }
  },
  created () {
    let box = this.$store.getters['projects/findBoxById'](this.id)
    this.name = box.name
    this.inputFO = box.inputFO
    this.outputFO = box.outputFO
  },
  computed: {

  },
  methods: {

  }
}
</script>
