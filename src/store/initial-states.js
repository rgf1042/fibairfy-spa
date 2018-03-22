export default {
  user () {
    return {
      user: {
        id: 0,
        name: '',
        token: ''
      },
      locale: 'ca'
    }
  },
  projects () {
    return {
      current: {
        id: 0,
        name: '',
        latitude: 0.0,
        longitude: 0.0,
        zoom: 0,
        writable: true
      },
      list: []
    }
  },
  map () {
    return {
      latitude: 0.0,
      longitude: 0.0,
      zoom: 1
    }
  },
  paths () {
    return {
      paths: [],
      types: [
        'aerial',
        'facade',
        'underground',
        'notdefined'
      ]
    }
  },
  sites () {
    return {
      sites: [],
      types: [
        'manhole',
        'pole',
        'room',
        'cabinet',
        'poe',
        'hook',
        'jump',
        'notdefined'
      ]
    }
  }
}
