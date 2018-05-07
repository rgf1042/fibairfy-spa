/* eslint-disable */
// =====================
// Tram
function Path(id, name, first_site, end_site, intermedial, type, m) {
  this.id = id
  this.name = name
  this.first_site = first_site || {}
  this.end_site = end_site || {}
  this.type = !type ? m.type_path_default : type
  this.polyline = null
  // We add first_site and end_site to dots array
  this.intermedial = intermedial || []
  this.color_building = 'red'
  this.color_did = 'blue'
  this.color_mouseover = 'green'
  this.observations = null
  this.map_parent = m
}
Path.prototype.setFirstSite = function(b) {
  this.first_site.id = b.id
  this.first_site.latlng = b.latlng
}
Path.prototype.setEndSite = function(b) {
  this.end_site.id = b.id
  this.end_site.latlng = b.latlng
  this.draw()
  this.map_parent.setIconInSiteById(this.first_site.id)
  this.map_parent.setIconInSiteById(this.end_site.id)
  this.map_parent.paths.push(this)
  this.map_parent.active_path = null
  if (this.end_site.id != this.first_site.id) {
    this.save()
  } else {
    // Esborrar link
    this.clear()
  }
}
Path.prototype.changeTypePath = function(status, type) {
  this.polyline.setStyle({ color: this.findPathColor(status, type) })
}
Path.prototype.findPathColor = function(status, type) {
  if (!type) type = this.type
  if (!type) type = this.map_parent.type_path_default
  let type_idx = this.map_parent.type_path.indexOf(type)

  let color
  switch (status) {
    case 'over':
    case 'active':
    case 'grey':
      color = this.map_parent.type_path_colors[status][type_idx]
      break
    default:
      color =
        this.map_parent.layerActive == 'civil'
          ? this.map_parent.type_path_colors['normal'][type_idx]
          : this.map_parent.type_path_colors['grey'][type_idx]
  }
  return color
}
Path.prototype.clear = function() {
  if (this.polyline) this.map_parent.map.removeLayer(this.polyline)
}

Path.prototype.draw = function() {
  var that = this
  // Pintar el Tram
  if (this.polyline) {
    this.clear()
  }

  var color = this.end_site.id
    ? this.findPathColor()
    : this.findPathColor('active')

    let dots = this.intermedial.slice(0, this.intermedial.length) || []
    dots.unshift(this.first_site.latlng)
    if (typeof this.end_site.latlng !== 'undefined')
      dots.push(this.end_site.latlng)
    if (this)
    this.polyline = new L.Polyline(dots, {
    color: color,
    weight: 5,
    opacity: 0.5,
    smoothFactor: 1,
  })
    .on('click', function(e) {
      return that.onPathClick(e)
    })
    .on('mouseover', function(e) {
      return that.onPathMouseOver(e)
    })
    .on('mouseout', function(e) {
      return that.onPathMouseOut(e)
    })
    .addTo(this.map_parent.map)
}
Path.prototype.addPoint = function(point) {
  if (!this.end_site.id) {
    if (this.first_site.id) {
      this.intermedial.push(point)
      this.draw()
    } else {
      console.log('Els trams comencen a una caixa.')
    }
  } else {
    console.log('Aquest tram ja està tancat.')
  }
}
Path.prototype.save = function () {
  let path = {
    project: this.map_parent.active_project.id,
    first: this.first_site.id,
    last: this.end_site.id,
    intermedial: this.intermedial,
    type: this.type
  }
  this.map_parent.vue.$store.dispatch('projects/addNewPath', path).then(response => {
    this.id = response.body.id
  }, error => {
    this.clear();
    this.map_parent.deletePathById(this.id);
    alert("There was a problem. Please, try again.");
    console.log(error)
  })
}

Path.prototype.onPathClick = function(e) {
  var that = this
  if (this.id) { // Ja s'ha creat i guardat
    switch (this.map_parent.layerActive) {
      case 'civil':
        this.map_parent.vue.$emit('edit-path', Number(this.id))
        break
      case 'infra':
        break
      case "fiber":
        // this.map_parent.active_fiber.addPath(this.id)
        console.log(this.map_parent.active_fiber.paths)
      break
    }
  }
}
Path.prototype.onPathMouseOver = function(e) {
  if (this.map_parent.layerActive === 'civil' && this.id) {
    this.map_parent.info.update('Tram ' + this.name + '(' + this.id + ')')
    this.changeTypePath('over')
  }
}
Path.prototype.onPathMouseOut = function(e) {
  if (this.map_parent.layerActive === 'civil' && this.id) {
    this.map_parent.info.update('')
    this.changeTypePath()
  }
}

Path.prototype.distance = function() {
  var metros_totales_ruta = 0
  var coordenadas_iniciales = null
  var array_coordenadas_polilinea = this.polyline._latlngs

  for (i = 0; i < array_coordenadas_polilinea.length - 1; i++) {
    coordenadas_iniciales = array_coordenadas_polilinea[i]
    metros_totales_ruta += coordenadas_iniciales.distanceTo(
      array_coordenadas_polilinea[i + 1]
    )
  }
  metros_totales_ruta = metros_totales_ruta.toFixed()
  return metros_totales_ruta
}
Path.prototype.getSegment = function(e) {
  /* This not working yet!! need i will work more
  var point = e.layerPoint;

  var points = this.polyline._originalPoints;
  var min_distance = L.LineUtil.pointToSegmentDistance(point, points[0], points[1]);
  for ( var i = 0; i < points.length; i++ ) {
    if ( i < points.length - 2 ) {
      if (min_distance > L.LineUtil.pointToSegmentDistance(point, points[i], points[ i + 1]) ) {
        min_distance = L.LineUtil.pointToSegmentDistance( point, points[i], points[ i + 1] );
        min_offset = i;
      }
    }
    console.log("---");
    console.log(point, points[i], points[ i + 1]);
    console.log(min_distance);
  }
*/
  console.log('')
}
export default Path
