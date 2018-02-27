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
      types: ['Aeri', 'Façana', 'Soterrat']
    }
  },
  sites () {
    return {
      sites: [],
      types: [
        'Arqueta',
        'Poste',
        'Cambra',
        'Armari',
        'Poe',
        'Ganxo',
        'Salt'
      ]
    }
  }
}
