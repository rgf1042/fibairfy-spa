<template>
  <b-container>
    <b-row>
      <b-col>
        <div class="loader" :hidden="!loading">

        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: 'spinner-loading',
  props: {
    loading: {

    }
  },
  data () {
    return {

    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  }
}

</script>
<style>
.loader {
  border: 9px solid #f3f3f3;
  border-radius: 50%;
  border-top: 9px solid #007bff;
  border-bottom: 10px solid #007bff;
  width: 50px;
  height: 50px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
