/* eslint-disable */
// var Box = require('./box');
import Path from './path'
// var Fiber = require('./fiber');
import L from 'leaflet'
// =====================
// Site

var Site = function (id, name, latlng, type, zone, m, boxes) {
  this.name = name // Nom del Lloc
  this.latlng = latlng // Posició del Lloc
  this.id = id // Identificador
  this.type = type // Tipus de lloc
  this.status = 'Planned'
  this.observations = null // Observacions
  this.marker = null // Marcador en el mapa
  this.map_parent = m // referencia al mapa on està
  this.zone = zone // Zona de guifi (location)

  this.boxes = boxes // We set boxes
  this.actualFusionSite = null // L'última grup de dades d'una fusió
}

Site.prototype.save = function () {
  let site = {
    name: this.name,
    project: this.map_parent.active_project.id,
    latitude: this.latlng.lat,
    longitude: this.latlng.lng,
    type: this.type,
    zone: this.zone,
    status: this.status
  }
  return new Promise((resolve, reject) => {
    this.map_parent.vue.$store.dispatch('projects/addNewSite', site).then(response => {
      this.id = response.body.id
      resolve(response)
    }, error => {
      reject(error)
    })
  })
}

Site.prototype.clear = function () {
  if (this.marker)
    this.map_parent.map.removeLayer(this.marker)
}
Site.prototype.draw = function () {
  var that = this
  this.marker = L.marker(this.latlng).addTo(that.map_parent.map)
  this.changeTypeIcon()
  if (!this.id) this.save().then(response => {
    this.setEvents()
  }, error => {
    this.clear();
    this.map_parent.deleteSiteById(this.id);
    alert("There was a problem. Please, try again.");
    console.log(error)
  })
  else {
    this.setEvents()
  }
}

Site.prototype.setEvents = function () {
  var that = this
  this.marker.
    on('click', function () {
      return that.onSiteClick()
    })
    .on('mouseover', function () {
      return that.onSiteMouseOver()
    })
    .on('mouseout', function () {
      return that.onSiteMouseOut()
    })
}

Site.prototype.changeTypeIcon = function (status, type) {
  if (!type) {
    type = this.type
  }
  type = type.toLowerCase()

  var icon
  switch (status) {
    case 'over':
      icon = this.map_parent.type_site_icon_over[type]
      break
    case 'active':
      icon = this.map_parent.type_site_icon_active[type]
      break
    case 'grey':
      icon = this.map_parent.type_site_icon_grey[type]
      break
    default:
      icon =
        this.map_parent.layerActive === 'civil'
          ? this.map_parent.type_site_icon[type]
          : this.map_parent.type_site_icon_grey[type]
  }
  this.marker.setIcon(icon)
}
// Mouse Events
Site.prototype.onSiteMouseOver = function (e) {
  if (this.map_parent.layerActive === 'civil') {
    switch (this.map_parent.status) {
      case 'path':
        this.changeTypeIcon('active')
        break
      default:
        this.map_parent.info.update('Site ' + this.name + '(' + this.id + ')')
        this.changeTypeIcon('over')
        // $('#make_site').text('Edita Lloc')
        break
    }
  } else if (this.map_parent.layerActive === 'infra') {
    switch (this.map_parent.status) {
      case 'box':
        break
      case 'fiber':
        if (this.countBox() > 0) this.changeTypeIcon('over')
        break
    }
  }
}
Site.prototype.onSiteMouseOut = function (e) {
  if (this.map_parent.layerActive === 'civil') {
    switch (this.map_parent.status) {
      case 'path':
        if (
          (this.map_parent.active_path &&
            this.map_parent.active_path.first_site &&
            this.map_parent.active_path.first_site !== this.id) ||
          !this.map_parent.active_path
        ) {
          this.changeTypeIcon()
        }
        break
      case 'fiber':
        this.showIconBox()
        break
      default:
        this.map_parent.info.update('')
        this.changeTypeIcon()
        // $('#make_site').text('Crea Lloc');
        break
    }
  } else if (this.map_parent.layerActive === 'infra') {
    switch (this.map_parent.status) {
      case 'box':
        break
      case 'fiber':
        if (
          (this.map_parent.active_fiber &&
            this.map_parent.active_fiber.first_site &&
            this.map_parent.active_fiber.first_site !== this.id) ||
          !this.map_parent.active_fiber
        ) {
          this.showIconBox()
        }
        break
    }
  }
}

Site.prototype.onSiteClick = function (e){
  switch(this.map_parent.status){
    case "path":
      // Hi ha algun path actiu?
      if ((this.map_parent.active_path) && (this.map_parent.active_path.first_site)){
        // Sí
        console.log('tancar tram.')
        this.map_parent.active_path.setEndSite(this)
        this.map_parent.vue.$emit('active-path', Boolean(false))
      } else {
        // No n'hi ha cap actiu, el creem.
        console.log('inici tram.')
        this.changeTypeIcon('active')
        this.map_parent.active_path = new Path(null, null, null, null, new Array(), this.map_parent.type_path_default, this.map_parent)
        this.map_parent.active_path.setFirstSite(this)
        this.map_parent.vue.$emit('active-path', Boolean(true))
      }
      break
    case "split":
      alert("No es pot fer un split a un Lloc!")
      break
    case "site":
      // Anem a editar el site
      this.map_parent.vue.$emit('edit-site', Number(this.id))
      break
    case "box":
      // this.boxDefine()
      break
    case "fiber":
      // Hi ha alguna fibra activa?
      /* if ((this.map_parent.active_fiber) && (this.map_parent.active_fiber.first_site)) {
        // Sí
        this.map_parent.active_fiber.addSite(this)
      } else {
        // No n'hi ha cap actiu, el creem.
        console.log('inici fibra.')
        this.changeTypeIcon('over')
        this.map_parent.active_fiber = new Fiber(null, null, null, null, new Array(), null, this.map_parent.type_path_default, this.map_parent)
        this.map_parent.active_fiber.setFirstSite(this)
      } */
      break;
    case "":
      if (this.map_parent.layerActive === 'civil') this.map_parent.vue.$emit('edit-site', Number(this.id))
      else this.boxDefine()
    }
};

Site.prototype.showIconBox = function() {
  switch(this.map_parent.layerActive){
    case 'civil':
      this.changeTypeIcon()
      break
    case 'infra':
      if (this.countBox() > 0) {
        this.changeTypeIcon('active')
      } else {
        this.changeTypeIcon('grey')
      }
      break
  }
};
/*
Site.prototype.siteCallbackBoxes = function() {
  var that = this;

  // Mostrar els elements d'un site.
  for(idx_box in this.boxes){
    actual_box = this.boxes[idx_box];
    actual_box.addHtmlBox();
  }
};
Site.prototype.addBox = function(){
  // Add new
  var box = new Box(0,gUUID(),'',this.map_parent.type_box_default,this,this.map_parent);
  this.boxes[box.uuid] = box;
  box.addHtmlBox();
};
Site.prototype.deleteBox = function(uuid){
  //Buscar el box, i esborrar-lo
  box = this.boxes[uuid];
  if (box.id != 0)
    box.delete(box.id);
  else
    $('#box-'+ box.uuid).remove();
  delete this.boxes[uuid];
};
*/
Site.prototype.countBox = function(){
  return this.boxes.length
};
/*
// Pagina de Definició de fusió
Site.prototype.siteFusion = function(){
  if (!this.id) {
    alert("Aquesta caixa no ha estat grabada encarà!");
    return;
  }
  // Amagar mapa.
  $('#map-group').hide();
  $('#zoom-site-fusion-group').toggleClass('hide');

  this.siteFusionPaint();
};
Site.prototype.siteFusionPaint = function() {
  // Carreguem dades.
  var that =  this;

  var global = $('<div>');
  // Carreguem els boxes
  var strUrlBoxOfSites = that.map_parent.serverUrl + "/site/" + that.id + "/boxes";
  $.getJSON(strUrlBoxOfSites, function (dataBoxes){
    // Carreguem les fusions
    var strUrlMerger = that.map_parent.serverUrl + "/site/" + that.id + "/fusion";
    $.getJSON(strUrlMerger, function (dataMerger){
      // Carreguem les caixes.
      var strUrlSection = that.map_parent.serverUrl + "/site/" + that.id + "/fibers";
      $.getJSON(strUrlSection, function (dataSection) {
        // Insertem els boto per fusionar o la fusió que té.
        that.actualFusionSite = that.map_parent.buildSiteMerger(dataSection, dataMerger, dataBoxes);
        var row = $('<div class="row">').appendTo(global);
        $.each(that.actualFusionSite, function (index, tram) {
          try {
            colors = $.parseJSON(tram.colors);
          } catch (e) {
            console.log(e);
            console.log(tram.colors);
          }
          // If tram.id == 0, this information is in this site!!!
          if (tram.id === 0) {
            var dest_site_id = that.id;
            var dest_site = that.map_parent.getSite(dest_site_id);
          } else {
            var dest_site_id = (tram.first == that.id) ? tram.last : tram.first;
            var dest_site = that.map_parent.getSite(dest_site_id);
          }
          var columns = $('<div class="col-s-3">').appendTo(row);
          var title_tram = $('<h1 title="' + dest_site.id + '">' + dest_site.name + '</h1>');
          title_tram.on('click', function(){
            //that.map_parent.getPath(tram.id);
          });
          title_tram.appendTo(columns);
          var this_site = $('<ul>').appendTo(columns);
          if (colors) {
            $.each(colors, function (itub,tub){
                var this_tub = $(document.createElement("li")).text(tub.name);
                var this_fibers = $(document.createElement("ul"));
                $.each(tub.fibers, function (ifiber, fiber){
                  var this_select_fusio;
                  if (!fiber.fusionat){
                    // Creem les opcions d'aquell cable.
                    this_select_fusio = $(document.createElement('select')).attr('id', 'slct-' +  tram.id + "_" + tub.name + "_" + fiber.color).attr('class', 'select-fiber');
                    this_select_fusio.append($('<option>').text("").attr('value', ""));
                    $.each(tram.fusion_options, function(i, value) {
                      // Ell mateix no es pot sel·leccionar per fusionar-se
                      if (tram.id+"."+tub.name+"."+fiber.color != value.value) {
                        this_select_fusio.append($('<option>').text(value.label).attr('value', value.value));
                      }
                    });
                    this_select_fusio.on('change',function(e){ that.onChangeSelect(e); });
                  } else {
                    this_remove_link = $('<a class="fusion-fiber">')
                                        .attr('data-input', tram.id + "_" + tub.name + "_" + fiber.color)
                                        .html("&nbsp;X&nbsp;");
                    this_select_fusio = $('<div class="input-group">')
                                        .append($('<input type="text" class="readonly">')
                                          .attr({'value':fiber.fusionat, 'id':tram.id + "_" + tub.name + "_" + fiber.color}))
                                        .append($('<span class=".input-group-addon .supplement input-close">')
                                          .append(this_remove_link)
                                        );
                   this_remove_link.on('click', function(e){ that.removeFusion(e); });
                  }
                  var row_line = $('<div class="row">');
                  var col_line_Name = $('<div class="col-s-4">')
                      .append($('<input type="text" class="readonly">')
                        .attr('value',fiber.color))
                      .appendTo(row_line);
                  var col_line_Fusio = $('<div class="col-s-8">').append(this_select_fusio).appendTo(row_line);
                  var linea = row_line;
                  this_fibers.append(linea);
                });
               this_site.append(this_tub).append(this_fibers);
            });
          }
        });
      });
    });
  });
  // Netejem les caixes existents al mapa?
  $('.site-fusion').html("");
  global.appendTo($('.site-fusion'));
};
Site.prototype.onChangeSelect = function(e){
  strFFiber = new String(e.target.id).substr(5);
  strLFiber = $('#'+e.target.id).val();
  ffiber = strFFiber.split('_');
    lfiber = strLFiber.split('.');

    // Mirar de grabar la fusió
  var that = this;
  strUrl = this.map_parent.serverUrl + "/fusion";
  console.log('API call: ' + strUrl);
  $.post( strUrl, JSON.stringify({ "site": that.id , "ffiber": ffiber[0], "fcolor": ffiber[1]+"."+ffiber[2],
                                  "lfiber": lfiber[0], "lcolor": lfiber[1]+"."+lfiber[2], "project" : this.map_parent.active_project.id }))
    .done(function( data ) {
      that.map_parent.notify("Updated!");
      myMerger = $.parseJSON( data );
      that.siteFusionPaint();
    }, "json");
    // Recarregar el Site
};
Site.prototype.removeFusion = function(e){
  strFFiber = $(e.target).data('input');
  strLFiber = $('#'+strFFiber).val();
  ffiber = strFFiber.split('_');
  lfiber = strLFiber.split('.');

  // Esborrar merge
  var that = this;
  strUrl = this.map_parent.serverUrl + "/fusion";
  console.log('API call: ' + strUrl);
  $.delete( strUrl, JSON.stringify({ "site": that.id ,"ffiber": parseInt(ffiber[0]), "fcolor": ffiber[1]+"."+ffiber[2],
                                     "lfiber": parseInt(lfiber[0]), "lcolor": lfiber[1]+"."+lfiber[2], "project" : this.map_parent.active_project.id }))
    .done(function( data ) {
      that.map_parent.notify("Deleted!");
      myMerger = $.parseJSON( data );
      that.siteFusionPaint();
    }, "json");
  return false;
};
*/
export default Site
