<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">fiberfy</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item href="#" :disabled="loading" :active="mapActive" :to="{ name: 'Map'}">{{$t('menu.map')}}</b-nav-item>
        <b-nav-item href="#" :disabled="loading" :active="projectsActive" :to="{ name: 'Projects'}">{{$t('menu.projects')}}</b-nav-item>
        <b-nav-item href="#" :disabled="loading" :active="exportActive" :to="{ name: 'Export'}">{{$t('menu.export')}}</b-nav-item>
        <b-nav-item href="#" :disabled="loading" :active="importActive" :to="{ name: 'Import'}">{{$t('menu.import')}}</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right :disabled="loading">
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{user}}</em>
          </template>
          <b-dropdown-item :to="{ name: 'Profile'}">{{$t('menu.profile')}}</b-dropdown-item>
          <b-dropdown-item @click="onLogout">{{$t('menu.logout')}}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
  name: 'general-navbar',
  props: {
    mapActive: {

    },
    projectsActive: {

    },
    exportActive: {

    },
    importActive: {

    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user.name
    }
  },
  mounted () {
    this.$bus.$on('lock-menu', this.lock)
    this.$bus.$on('unlock-menu', this.unlock)
  },
  destroyed () {
    this.$bus.$off('lock-menu', this.lock)
    this.$bus.$off('unlock-menu', this.unlock)
  },
  methods: {
    onLogout (evt) {
      evt.preventDefault()
      this.$store.dispatch('user/logout')
      this.$router.push('/')
    },
    lock () {
      this.loading = true
    },
    unlock () {
      this.loading = false
    }
  }
}
</script>
