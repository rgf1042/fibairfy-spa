<template>
  <div style="position:relative">
      <input class="form-control" type="text" v-model="selection"
        :required="required"
        :disabled="disabled || loading"
        @keydown.enter ="enter"
        @keydown.down ="down"
        @keydown.up ="up"
        @input ="change"/>
      <ul class="dropdown-menu" style="width:100%" v-bind:class="{'show': openSuggestion}">
          <li v-for="(suggestion, index) in display"
              @click="suggestionClick(index, $event)">
              <a class="dropdown-item"
                v-bind:class="{'active': isActive(index)}"
                href="#">{{ suggestion.text }}
              </a>
          </li>
      </ul>
  </div>
</template>
<script>
export default {
  name: 'fiberfy-autocomplete',
  props: ['selectedField', 'returnedField', 'url', 'value', 'required', 'inputData', 'type', 'disabled'],
  data () {
    return {
      selection: '',
      remoteData: [],
      open: false,
      current: 0,
      id: this.value,
      loading: false
    }
  },
  mounted () {
    this.loadSelectionById(this.value) // We load existing text
  },
  computed: {
    openSuggestion () {
      return this.selection !== '' &&
             this.display.length !== 0 &&
             this.open === true
    },
    display () {
      let display = []
      for (let x in this.data) {
        display[x] = {}
        display[x].text = this.data[x][this.selectedField]
        display[x].id = this.data[x][this.returnedField]
      }
      return display.filter((item) => {
        let upperItem = item.text.toUpperCase()
        let upperSelection = this.selection.toUpperCase()
        return upperItem.indexOf(upperSelection) >= 0
      })
    },
    data () {
      if (this.type === 'remote') return this.remoteData
      else if (this.type === 'local') return this.inputData
      else return []
    }
  },
  watch: {
    value: function (newVal, oldVal) {
      if (newVal !== this.id) {
        this.id = newVal
        this.loadSelectionById(newVal)
      }
    }
  },
  methods: {
    loadSelectionById (id) {
      if (this.type === 'remote') {
        this.loading = true
        this.selection = 'loading...'
        this.$http.get(this.url + id)
                  .then(response => {
                    this.selection = response.body[this.selectedField]
                    this.loading = false
                  }, error => {
                    console.log(error)
                    this.loading = false
                    this.selection = ''
                  })
      } else {
        let item = this.display.find(item => item.id === id)
        if (item) this.selection = item.text
      }
    },
    fetchData () {
      if (this.type === 'remote') { // If data is stored remotely
        if (this.selection.length > 2) {
          let where = {}
          where[this.selectedField] = {
            contains: this.selection
          }
          let query = { where: where, sort: this.selectedField + ' ASC' }

          this.$http.get(this.url, { params: query })
                      .then(response => {
                        this.remoteData = response.body
                      }, error => {
                        console.log(error)
                      })
        } else {
          // We erase data
          if (this.remoteData.length > 0) this.remoteData = []
        }
      }
    },
    enter (evt) {
      evt.preventDefault()
      this.id = this.display[this.current].id
      this.selection = this.display[this.current].text
      this.open = false
      this.$emit('input', this.id) // v-model
    },

    // When up pressed while suggestions are open
    up (evt) {
      evt.preventDefault()
      if (this.current > 0) this.current--
    },

    // When up pressed while suggestions are open
    down (evt) {
      evt.preventDefault()
      if (this.current < this.display.length - 1) this.current++
    },

    // For highlighting element
    isActive (index) {
      return index === this.current
    },

    // When the user changes input
    change (evt) {
      evt.preventDefault()
      this.fetchData()
      if (this.open === false) {
        this.open = true
        this.current = 0
      }
    },

    // When one of the suggestion is clicked
    suggestionClick (index, evt) {
      evt.preventDefault()
      this.id = this.display[index].id
      this.selection = this.display[index].text
      this.open = false
      this.$emit('input', this.id) // v-model
    }
  }
}

</script>
