<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <label>{{caption}}</label>
      </b-col>
      <b-col cols="8">
        <input class="form-control" type="text" v-model="selection"
        @keydown.enter="trigSearch"/>
      </b-col>
      <b-col cols="2">
        <b-button @click="trigSearch" variant="primary">{{$t('general.search')}}</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: 'fiberfy-search',
  props: {
    url: {

    },
    inputData: {

    },
    type: {

    },
    selectedField: {

    },
    caption: {
      default: function () {
        return 'name:'
      }
    },
    populate: {
      default: function () {
        return null
      }
    }
  },
  data () {
    return {
      selection: ''
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    fetchData () {
      return new Promise((resolve, reject) => {
        if (this.type === 'remote') { // If data is stored remotely
          let where = {}
          where[this.selectedField] = {
            contains: this.selection
          }
          let query = { where: where, sort: this.selectedField + ' ASC', populate: this.populate }

          this.$http.get(this.url, { params: query })
                      .then(response => {
                        this.$http.get(this.url + 'count', { params: query }).then(response2 => {
                          let result = {
                            count: response2.body.count,
                            content: response.body
                          }
                          resolve(result)
                        }, error => {
                          reject(error)
                        })
                      }, error => {
                        reject(error)
                      })
        } else if (this.type === 'local') {
          let response = this.inputData.filter((item) => {
            item[this.selectedField].toLowerCase().includes(this.selection.toLowerCase())
          })
          resolve(response)
        }
      })
    },
    trigSearch (evt) {
      evt.preventDefault()
      this.search()
    },
    search () {
      if (!this.selection.length) this.$emit('input', null)
      else {
        this.fetchData().then(response => {
          this.$emit('input', response) // v-model
        }, error => {
          console.log(error)
        })
      }
    }
  }
}

</script>
