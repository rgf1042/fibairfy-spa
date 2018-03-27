// Leaflet
/* eslint-disable */
import L from 'leaflet'
// Internal modules
import Site from './site'
// var Box = require('./box')
import Path from './path'
// var Fiber = require('./fiber')
// var Pfusion = require('./pfusion')
// var Projecte = require('./projecte')
// var Config = require('./config')
// var IOGeoJSON = require('./iogeojson')
// requier leaflet-search
var LeafletSearch = require('leaflet-search')

// =====
// Mapa
function Mapa (divMap, mapId, status, layerActive, vue) {
  var that = this
  this.vue = vue // Passem la instància de vue
  this.attributionTiles =
    'Guifi FO <a href="http://openstreetmap.org">&copy; OpenStreetMap</a>,<a href="http://maps.google.es">&copy; Google Maps</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
  this.tiles = [
    {
      tiles: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 20
      }
    },
    {
      tiles: '  http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      options: {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    },
    {
      tiles: '  http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      options: {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    },
    {
      tiles: '  http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      options: {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    },
    {
      tiles: '  http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      options: {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    }
  ]
  this.tilesIndex = 0
  // create a tileLayer with the tiles, attribution
  /* this.serverUrl = '/api/v1'
  this.project_default_name = 'default'
  this.project_default_latitude = 41.66060124302088
  this.project_default_longitude = 1.571044921875
  this.project_default_zoom = 8 */

  // Llistat des de modul sites vuex
  this.type_site = this.vue.$store.state.projects.sites.types

  this.type_site_icon = []
  this.type_site_icon_over = []
  this.type_site_icon_active = []
  this.type_site_icon_grey = []
  this.type_site_default = this.type_site[0]

  // Llistat tancat? (TODO: Passar-ho a una taula.)
  this.type_path = this.vue.$store.state.projects.paths.types
  this.type_path_colors = []
  this.type_path_colors['normal'] = ['#000080', '#254117', '#806517', '#7A1780']
  this.type_path_colors['over'] = ['#95b9c7', '#99C68E', '#AF9B60', '#E065E7']
  this.type_path_colors['active'] = ['#357ec7', '#7FE817', '#E8A317', '#D519A1']
  this.type_path_colors['grey'] = ['#2f2f2f', '#2f2f2f', '#2f2f2f', '#2f2f2f']
  this.type_path_default = this.type_path[0]

  // Llistat de box (TODO: Passar-ho a una taula.)
  this.type_box = [
    { name: 'Troncal', in: 0, out: 0 },
    { name: 'CTO', in: 0, out: 0 },
    { name: 'Splitter', in: 1, out: 5 },
    { name: 'PatchPanel', in: 12, out: 12 }
  ]
  this.type_box_default = this.type_box[0]

  // Llistat templates
  /* this.template_path = [
    'Not Update',
    'Cable 6FO1T TIA598',
    'Cable 6FO1T C2',
    'Cable 8FO1T TIA598',
    'Cable 12FO1T TIA598',
    'Cable 16FO2T TIA598',
    'Cable 32FO4T TIA598',
    'Cable 48FO6T TIA598',
    'Cable 48FO4T TIA598',
    'Cable 72FO9T TIA598',
  ]
  this.template_jsons = [
    '',
    '[{"name":"black","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"}]}]',
    '[{"name":"black","fibers":[{"color":"green"},{"color":"red"},{"color":"blue"},{"color":"yellow"},{"color":"grey"},{"color":"purple"}]}]',
    '[{"name":"blue","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]}]',
    '[{"name":"black","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"},{"color":"yellow"},{"color":"purple"},{"color":"pink"},{"color":"cyan"}]}]',
    '[{"name":"blue","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"orange","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]}]',
    '[{"name":"blue","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"orange","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"green","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"brown","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]}]',
    '[{"name":"blue","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"orange","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"green","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"brown","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"grey","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"white","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]}]',
    '[{"name":"blue","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"},{"color":"yellow"},{"color":"purple"},{"color":"pink"},{"color":"cyan"}]},{"name":"orange","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"},{"color":"yellow"},{"color":"purple"},{"color":"pink"},{"color":"cyan"}]},{"name":"green","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"},{"color":"yellow"},{"color":"purple"},{"color":"pink"},{"color":"cyan"}]},{"name":"brown","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"},{"color":"yellow"},{"color":"purple"},{"color":"pink"},{"color":"cyan"}]}]',
    '[{"name":"blue","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"orange","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"green","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"brown","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"grey","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"white","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"red","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"black","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"yellow","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]}]',
  ] */
  // Estatus
  // site
  // path
  // box
  // fibra
  // split ?

  // Apliquem status a través dels menus superiors (compatibiltat Vue)
  this.status = status

  // Input-Output
  // this.ioMap = new IOGeoJSON(this)
  // Layer Active (civil, infra)
  this.layerActive = layerActive
  // Trams
  // Dibuixant en aquest moment.
  this.active_path = null
  // Site actual
  this.active_site = null
  // Dibuixant fibra
  this.active_fiber = null

  // Active project
  this.active_project = this.vue.$store.state.projects.current // Apliquem el projecte actual amb el store de Vue

  // default zone
  this.default_zone = this.vue.$store.state.projects.current.defaultZone

  // Map details
  this.map_data = this.vue.$store.state.projects.map // Apliquem el projecte actual amb el store de Vue
  // Llista de Trams fets al mapa.
  this.paths = new Array()

  // Llista de Site
  this.sites = new Array()

  // Llistat de fibres
  this.fibers = []

  // Llista de Projectees de l'usuari
  this.projects = []

  // Dibuix del Mapa
  this.map = divMap

  this.map = L.map(mapId, {
    scrollWheelZoom: true
  })

  // Declare new red Icon & blue icon.

  L.Icon.Default.imagePath = 'static/images/'
  var RedIcon = L.Icon.extend({
    options: {
      iconUrl: L.Icon.Default.imagePath + 'red-marker-icon.png'
    }
  })
  var BlueIcon = L.Icon.extend({
    options: {
      iconUrl: L.Icon.Default.imagePath + 'marker-icon.png'
    }
  })
  var GreenIcon = L.Icon.extend({
    options: {
      iconUrl: L.Icon.Default.imagePath + 'green-marker-icon.png'
    }
  })

  this.redMarker = new RedIcon()
  this.blueMarker = new BlueIcon()
  this.greenMarker = new GreenIcon()

  // Carregar Icons dels sites.
  for (let idx in this.type_site) {
    var name = this.type_site[idx]
    name = name.toLowerCase()
    // Icon definitions
    var objectSiteIcon = {}
    var objectSiteIconOver = {}
    var objectSiteIconActive = {}
    var objectSiteIconGrey = {}

    objectSiteIcon[name] = L.Icon.extend({ options : { iconUrl: L.Icon.Default.imagePath + name + '.png'}})
    objectSiteIconOver[name] = L.Icon.extend({ options : { iconUrl: L.Icon.Default.imagePath + name + '.over.png'}})
    objectSiteIconActive[name] = L.Icon.extend({ options : { iconUrl: L.Icon.Default.imagePath + name + '.active.png'}})
    objectSiteIconGrey[name] = L.Icon.extend({ options : { iconUrl: L.Icon.Default.imagePath + name + '.grey.png'}})

    this.type_site_icon[name] = new objectSiteIcon[name]()
    this.type_site_icon_over[name] = new objectSiteIconOver[name]()
    this.type_site_icon_active[name] = new objectSiteIconActive[name]()
    this.type_site_icon_grey[name] = new objectSiteIconGrey[name]()

  }
  // console.log(this);

  // Search
  this.map.addControl(
    new LeafletSearch({
      url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
      jsonpParam: 'json_callback',
      propertyName: 'display_name',
      propertyLoc: ['lat', 'lon'],
      marker: L.circleMarker([0, 0], { radius: 30 }),
      autoCollapse: true,
      autoType: false,
      minLength: 2
    })
  )

  // Posicio inicial i zoom.

  this.map.setView(
    L.latLng(fiberfy.constants.PROJECT_DEFAULT_LATITUDE, fiberfy.constants.PROJECT_DEFAULT_LONGITUDE),
    fiberfy.constants.PROJECT_DEFAULT_ZOOM
  )

  // Event de click
  this.map.on('click', function (e) {
    that.onClick(e)
    if (that.map.scrollWheelZoom.enabled()) {
      that.map.scrollWheelZoom.disable()
    } else {
      that.map.scrollWheelZoom.enable()
    }
  })

  this.map.on('move', function (e) {
    let ll = that.map.getCenter()
    that.vue.$store.dispatch('projects/map/setLocation', { latitude: ll.lat, longitude: ll.lng})
  })

  this.map.on('zoom', function (e) {
    let zoom = that.map.getZoom()
    that.vue.$store.dispatch('projects/map/setZoom', zoom)
  })

  this.tileLayer()

  // Info:
  this.info = L.control()

  this.info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info')
    this.update()
    return this._div
  }

  this.info.update = function (msg) {
    if (typeof msg !== 'undefined') {
      this._div.innerHTML = msg
      if (msg !== '') this._div.removeAttribute('hidden')
      else this._div.setAttribute('hidden', true)
    }
    else this._div.setAttribute('hidden', true)
  }

  this.info.addTo(this.map)
}
Mapa.prototype.setStatus = function (status) {
  if (this.status === 'path')
    if (this.active_path)
      this.active_path.clear()
      this.active_path = null
  this.status = status
}
Mapa.prototype.rollTiles = function () {
  this.tilesIndex = (this.tilesIndex + 1) % this.tiles.length
  this.tileLayer(this.tiles[this.tilesIndex])
}
Mapa.prototype.tileLayer = function (tiles) {
  // add the tile layer to the map
  if (!tiles) {
    tiles = this.tiles[this.tilesIndex]
    tiles.options.attribution = this.attributionTiles
  }

  this.layer = L.tileLayer(tiles.tiles, tiles.options)
  this.layer.addTo(this.map)
}

Mapa.prototype.load = function () {
  var that = this
  // Netejem les caixes existents al mapa
  for (let idx_site in this.sites) {
    var s = this.sites[idx_site]
    s.clear()
  }
  this.sites = []

  // Netejem els paths existents al mapa
  for (let idx_paths in this.paths) {
    var p = this.paths[idx_paths]
    p.clear()
  }
  this.paths = []

  // Netejem les fibres existents al mapa
  for (let idx_fiber in this.fibers) {
    var f = this.fibers[idx_fiber]
    f.clear()
  }
  this.fibers = []

  // Carreguem les caixes.
  let sites = this.vue.$store.state.projects.sites.sites
  for (let x in sites) {
    let site = new Site(sites[x].id, sites[x].name,
      L.latLng(sites[x].latitude,
      sites[x].longitude),
      sites[x].type,
      sites[x].zone,
      that)
    this.sites.push(site)
  }
  let paths = this.vue.$store.state.projects.paths.paths

  // Carreguem els paths.
  for (let x in paths) {
    let intermedial = paths[x].intermedial
    let path = new Path(
      paths[x].id,
      paths[x].name,
      {id: paths[x].first.id, latlng: {lat: paths[x].first.latitude, lng: paths[x].first.longitude}},
      {id: paths[x].last.id, latlng: {lat: paths[x].last.latitude, lng: paths[x].last.longitude}},
      intermedial,
      paths[x].type,
      that
    )
    this.paths.push(path)
  }
  // ...
  /*
      // Carreguem les fibres (afegim .id degut a nova api)
      strUrl = that.serverUrl + '/fiber?project=' + that.active_project.id
      $.getJSON(strUrl, function(data) {
        $.each(data, function(index, value) {
          path = new Fiber(
            value.id,
            value.name,
            value.first.id,
            value.last.id,
            $.parseJSON(value.intermedial),
            $.parseJSON(value.colors),
            value.template,
            that
          )
          path.observations = value.observations
          that.fibers.push(path)
        })
      }) */
      // Posició del projecte.
  that.active_project.latitude = that.active_project.latitude
    ? that.active_project.latitude
    : that.project_default_latitude
  that.active_project.longitude = that.active_project.longitude
    ? that.active_project.longitude
    : that.project_default_longitude
  that.active_project.zoom = that.active_project.zoom
    ? that.active_project.zoom
    : that.project_default_zoom

  that.map.setView(
    L.latLng(that.map_data.latitude, that.map_data.longitude),
    that.map_data.zoom
  )
  that.clearLayers()
  that.redraw()
}
Mapa.prototype.loadInfra = function () {
  // Molt a saco, si hi han molts nodes!!!
  for (var idx_site in this.sites) {
    var s = this.sites[idx_site]
    s.loadBoxes()
  }
}
Mapa.prototype.redraw = function () {
  // Tornem a posar el tileLayer
  this.tileLayer()
  // Pintem tots les caixes
  for (let x in this.sites) {
    this.sites[x].draw()
  }
  // Pintem els trams
  for (let x in this.paths) {
    this.paths[x].draw()
  }
}
Mapa.prototype.clearLayers = function () {
  // Seria interessant només esborrar aquells que son d'un tram.
  var that = this
  this.map.eachLayer(function (layer) {
    that.map.removeLayer(layer)
  })
}

Mapa.prototype.setLayerActive = function (layer) {
  this.layerActive = layer
  this.changeColor(layer)
}

Mapa.prototype.changeColor = function (option) {
  var status = option === 'infra' ? 'grey' : 'normal'
  // Canviem els color a tots els llocs.
  for (let idx_site in this.sites) {
    var s = this.sites[idx_site]
    s.changeTypeIcon(status)
  }

  // Canviem els colors a tots els trams.
  for (let idx_paths in this.paths) {
    var p = this.paths[idx_paths]
    p.changeTypePath(status)
  }
  /*
  // Pintem o esborrem la fibra tirada?
  for (let idx_fiber in this.fibers) {
    var f = this.fibers[idx_fiber]
    if (option === 'civil') {
      f.clear()
    } else if (option === 'infra') {
      f.draw()
    }
  } */
}

Mapa.prototype.loadExternalMap = function () {
  var that = this
  var track = new L.KML('/mapa/doc.kml', { async: true })
  that.info.update('Loading map')
  track.on('loaded', function (e) {
    that.map.fitBounds(e.target.getBounds())
    that.info.update('')
  })
  this.map.addLayer(track)
}

Mapa.prototype.onClick = function (e) {
  switch (this.status) {
    case 'path':
      this.active_path.addPoint(e.latlng)
      break
    case 'site':
      var mysite = new Site(
        null,
        'site' + Math.floor(Math.random() * 100000),
        e.latlng,
        this.type_site_default,
        this.default_zone,
        this
      )
      this.sites.push(mysite)
      mysite.draw()
      break
    case 'split':
      // alert("Només podem fer un split a un Tram.")
      break
    default:
      // alert("status: '" + status + "' not exist!");
      break
  }
}
/*
Mapa.prototype.projectManager = function() {
  $('#map-group').hide()
  $('#form-project-group').removeClass('hide')
}
// Obra civil
Mapa.prototype.makeSection = function() {
  this.changeStatus('path', '#make_section')
}
Mapa.prototype.makeSite = function() {
  this.changeStatus('site', '#make_site')
}
Mapa.prototype.makeSplit = function() {
  this.changeStatus('split', '#split_path')
}

// infraestructura
Mapa.prototype.makeFiber = function() {
  this.changeStatus('fiber', '#make_fiber')
}
Mapa.prototype.makeBox = function() {
  this.changeStatus('box', '#make_box')
} */

/* Mapa.prototype.getPathBeetwenSites = function(s1, s2) {
  //Busquem a tots els paths  si hi ha algun que els sites coincideixen.
  for (var idx_paths in this.paths) {
    var p = this.paths[idx_paths]
    if (
      (p.first_site === s1 && p.end_site === s2) ||
      (p.first_site === s2 && p.end_site === s1)
    )
      return p.id
  }
  return null
}

Mapa.prototype.convertBoxesInPatchs = function(Boxes) {
  var siteFO = {}
  siteFO.id = 0
  siteFO.colorsJSON = []
  for (idx_box in Boxes) {
    var box = Boxes[idx_box]
    switch (box.type.toLowerCase()) {
      case 'splitter':
      case 'patchpanel':
        tmpColorsJSON = {}
        tmpColorsJSON.name = box.name
        tmpColorsJSON.fibers = []
        for (var intX = 1; intX <= box.inputFO; intX++) {
          tmpColorsJSON.fibers.push({ color: 'in-' + intX })
        }
        for (var intX = 1; intX <= box.outputFO; intX++) {
          tmpColorsJSON.fibers.push({ color: 'out-' + intX })
        }
        siteFO.colorsJSON.push(tmpColorsJSON)
        break
    }
  }
  siteFO.colors = JSON.stringify(siteFO.colorsJSON)
  return siteFO
}

Mapa.prototype.buildSiteMerger = function(Trams, Fusions, Boxes) {
  // Bucle  per "Marcar" les fusions existents.
  Trams.push(this.convertBoxesInPatchs(Boxes))
  for (idx_tram in Trams) {
    Tram = Trams[idx_tram]
    try {
      colors = $.parseJSON(Tram.colors)
    } catch (e) {
      console.log(e)
      console.log(Tram.colors)
    }
    for (idx_cable in colors) {
      cable = colors[idx_cable]
      for (idx_fiber in cable.fibers) {
        fiber = cable.fibers[idx_fiber]
        // Ja tenim una fibre ara li fem el seu llistat.
        // Validar que no te una fusió ja
        fusionat = existMerger(Tram.id, cable.name, fiber.color, Fusions)
        if (fusionat != '') {
          fiber.fusionat = fusionat
        }
      }
    }
    Trams[idx_tram].colors = JSON.stringify(colors)
  }
  //Bucle per calcular les opcions de fusió
  for (idx_tram_A in Trams) {
    Tram_A = Trams[idx_tram_A]
    try {
      colors_A = $.parseJSON(Tram_A.colors)
    } catch (e) {
      console.log(e)
      console.log(Tram_A.colors)
    }
    var options_fiber = new Array()
    for (idx_tram_B in Trams) {
      Tram_B = Trams[idx_tram_B]
      //      if (Tram_A.id != Tram_B.id){
      try {
        colors_B = $.parseJSON(Tram_B.colors)
      } catch (e) {
        console.log(e)
        console.log(Tram_B.colors)
      }
      for (idx_cable_B in colors_B) {
        cable_B = colors_B[idx_cable_B]
        for (idx_fiber_B in cable_B.fibers) {
          fiber_B = cable_B.fibers[idx_fiber_B]
          // Està fusionat ja aquesta fibra?
          // No, doncs la possem com a sel·leccionable.
          if (!fiber_B.fusionat) {
            options_fiber.push({
              label: Tram_B.id + '.' + cable_B.name + '.' + fiber_B.color,
              value: Tram_B.id + '.' + cable_B.name + '.' + fiber_B.color,
            })
          }
        }
      }
      //      }
    }
    Trams[idx_tram_A].fusion_options = options_fiber
  }
  return Trams
}

function existMerger(tram, tub, color, mergers) {
  for (idx_merger in mergers) {
    merger = mergers[idx_merger]
    if (merger.ffiber === tram && merger.fcolor === tub + '.' + color)
      return merger.lfiber + '.' + merger.lcolor
    if (merger.lfiber === tram && merger.lcolor === tub + '.' + color)
      return merger.ffiber + '.' + merger.fcolor
  }
  return ''
}

Mapa.prototype.havePaths = function(id) {
  for (idx_path in this.paths) {
    var path = this.paths[idx_path]
    if (path.first_site === id || path.end_site === id) {
      return true
    }
  }
  return false
}

Mapa.prototype.haveFibers = function(id) {
  for (idx_fiber in this.fibers) {
    var fiber = this.fibers[idx_fiber]
    if (fiber.paths.indexOf(id) != -1) {
      return true
    }
  }
  return false
} */
Mapa.prototype.setIconInSiteById = function(id, status, type) {
  for (let idx_site in this.sites) {
    let site = this.sites[idx_site]
    if (site.id === id) {
      site.changeTypeIcon(status, type)
      break
    }
  }
}

/*
Mapa.prototype.notify = function(text) {
  $('.notify').text(text)
  setTimeout(function() {
    $('.notify').text('')
  }, 1000)
} */

/*
Mapa.prototype.question = function(text, callback) {
  $('.question .message').text(text)
  $('.question').show()
  $('html, body').animate(
    {
      scrollTop: $('.question').offset().top,
    },
    1000
  )
  $('.question button').click(function() {
    $('.question .message').text('')
    $('.question').hide()
    callback($(this).attr('class'))
  })
} */
/*
Mapa.prototype.getSite = function(id) {
  for (idx_site in this.sites) {
    site = this.sites[idx_site]
    if (site.id === id) {
      return site
    }
  }
  return null
}

Mapa.prototype.getPath = function(id) {
  for (idx_path in this.paths) {
    path = this.paths[idx_path]
    if (path.id === id) {
      return path
    }
  }
  return null
}
*/
Mapa.prototype.deleteSiteById = function (id) {
  for (let idx_site in this.sites) {
    let site = this.sites[idx_site]
    if (site.id === id) {
      delete this.sites[idx_site]
      break
    }
  }
}

Mapa.prototype.deletePathById = function(id) {
  for (let idx_path in this.paths) {
    let path = this.paths[idx_path]
    if (path.id === id) {
      delete this.paths[idx_path]
      break
    }
  }
}
/*
Mapa.prototype.deleteFiberById = function(id) {
  for (idx_fiber in this.fibers) {
    fiber = this.fibers[idx_fiber]
    if (fiber.id === id) {
      delete this.fibers[idx_fiber]
      break
    }
  }
} */
// =====
export default Mapa
