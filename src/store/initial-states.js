export default {
  user () {
    return {
      user: {
        id: null,
        name: '',
        token: ''
      },
      locale: 'ca'
    }
  },
  projects () {
    return {
      current: {
        id: null,
        name: '',
        latitude: 0.0,
        longitude: 0.0,
        zoom: 0,
        writable: true,
        defaultZone: {
          id: null
        }
      },
      list: []
    }
  },
  map () {
    return {
      latitude: 0.0,
      longitude: 0.0,
      zoom: 1,
      layer: 'civil',
      baseTiles: [
        {
          name: 'OpenStreetMap',
          tiles: fiberfy.constants.DEFAULT_TILE_SERVER, // eslint-disable-line
          options: {
            maxZoom: 20,
            attribution: 'Guifi FO <a href="http://openstreetmap.org">&copy; OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
          }
        },
        {
          name: 'Google Maps 1',
          tiles: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          options: {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '<a href="http://maps.google.es">&copy; Google Maps</a> contributors'
          }
        },
        {
          name: 'Google Maps 2',
          tiles: '  https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          options: {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '<a href="http://maps.google.es">&copy; Google Maps</a> contributors'
          }
        },
        {
          name: 'Google Maps 3',
          tiles: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          options: {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '<a href="http://maps.google.es">&copy; Google Maps</a> contributors'
          }
        },
        {
          name: 'Google Maps 4',
          tiles: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          options: {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '<a href="http://maps.google.es">&copy; Google Maps</a> contributors'
          }
        }
      ],
      overlayTiles: [
        {
          name: 'Guifi.net nodes',
          tiles: 'https://guifimaps.guifi.net/cgi-bin/mapserv?map=/var/www/guifimaps/GMap.map',
          options: {
            format: 'image/png',
            transparent: true,
            version: '1.1.1',
            uppercase: true,
            layers: 'Nodes'
          }
        },
        {
          name: 'Guifi.net links',
          tiles: 'https://guifimaps.guifi.net/cgi-bin/mapserv?map=/var/www/guifimaps/GMap.map',
          options: {
            format: 'image/png',
            transparent: true,
            version: '1.1.1',
            uppercase: true,
            layers: 'Links'
          }
        },
        {
          name: 'Punts fibra òptica guifi.net',
          tiles: 'https://guifimaps.guifi.net/cgi-bin/mapserv?map=/var/www/guifimaps/GMap.map',
          options: {
            format: 'image/png',
            transparent: true,
            version: '1.1.1',
            uppercase: true,
            layers: 'Sites'
          }
        },
        {
          name: 'Trams fibra òptica guifi.net',
          tiles: 'https://guifimaps.guifi.net/cgi-bin/mapserv?map=/var/www/guifimaps/GMap.map',
          options: {
            format: 'image/png',
            transparent: true,
            version: '1.1.1',
            uppercase: true,
            layers: 'Paths'
          }
        }
      ],
      selectedOverlayTiles: [

      ],
      selectedBaseTile: 0
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
        'notdefined',
        'manhole',
        'pole',
        'room',
        'cabinet',
        'poe',
        'hook',
        'jump'
      ]
    }
  },
  boxes () {
    return {
      sites: {},
      boxes: {},
      types: [
        'mainline',
        'CTO',
        'splitter',
        'patchpanel'
      ]
    }
  },
  cables () {
    return {
      cables: {},
      sites: {}
    }
  },
  tubes () {
    return {
      cables: {},
      tubes: {}
    }
  },
  fibers () {
    return {
      tubes: {},
      fibers: {}
    }
  },
  fusions () {
    return {
      fibers: {

      },
      boxes: {

      },
      fusions: {
        fibers: {

        },
        boxes: {

        },
        data: {

        }
      }
    }
  },
  templates () {
    return {
      fiberTemplates: [],
      statusList: [
        'Planned',
        'Reserved',
        'Building',
        'Testing',
        'Working',
        'Dropped',
        'Inactive'
      ]
    }
  }
}
