/* eslint-disable */
// =====================
// Tram
function Fiber(id, name, first_site, end_site, paths, colors, template, m){
  this.id = id;
  this.name = name;
  this.first_site = first_site;
  this.end_site = end_site;
  this.template = (!template) ? 0 : template;
  this.polyline = null;
  this.paths = paths;
  this.sites = [];
  this.status = 'Planned';
  this.colors = colors;
  this.color_building = "red";
  this.color_did = "blue";
  this.color_mouseover = "green";
  this.observations = null;

  this.map_parent = m;

  // Calcula sites
  if (this.paths == null) {
    console.log("La fibra '" +  this.id + "', no té paths?");
  } else if (this.paths.length > 0) {
    this.getSites();
  }
  if (this.id) {
    this.attachToPath()
  }

}
Fiber.prototype.setFirstSite = function(b){
  this.first_site = b.id;
  this.sites.push(b.id);
};
Fiber.prototype.setEndSite = function(b){
  this.end_site = b.id;
  this.map_parent.setIconInSiteById(this.first_site);
  this.map_parent.setIconInSiteById(this.end_site);
  this.map_parent.fibers.push(this);
  this.map_parent.active_path = "";
  if (this.end_site != this.first_site) {
    this.save();
    this.clear() // We delete (Now paths manage cables)
  } else {
    // Esborrar link
    this.clear();
  }
};
Fiber.prototype.changeTypeFiber = function(status, type) {
  this.polyline.setStyle( { color: this.findFiberColor(status, type) });
};

Fiber.prototype.findFiberColor = function(status, type) {
  if (!type) type = this.type;
  if (!type) type = this.map_parent.type_path_default;
  let type_idx = this.map_parent.type_path.indexOf(type);

  var color;
  switch( status ){
    case "over":
    case "active":
    case "grey":
      color = this.map_parent.type_path_colors[status][type_idx];
      break;
    default:
      color = (this.map_parent.layerActive === 'civil') ? this.map_parent.type_path_colors['normal'][type_idx] : this.map_parent.type_path_colors['grey'][type_idx];
  }
  return color;
};
Fiber.prototype.clear = function() {
  for (let x in this.paths) {
    let path = this.map_parent.getPath(this.paths[0])
    path.changeTypePath('')
  }
  if (this.polyline)
    this.map_parent.map.removeLayer(this.polyline);
};

Fiber.prototype.getSites = function() {

  var prePath = this.map_parent.getPath(this.paths[0].id);
  for(var x = 1; x < this.paths.length; x++){
    var actPath = this.map_parent.getPath(this.paths[x].id);
    if ((prePath.first_site.id === actPath.first_site.id) || (prePath.first_site.id === actPath.end_site.id)) {
      if (this.sites.length === 0){
        // Només pot passar la primer vegada
        this.sites.push(prePath.end_site.id);
      }
      if(prePath.first_site.id === actPath.end_site.id) {
        this.sites.push(actPath.end_site.id);
        if (x === this.paths.length - 1 ) this.sites.push(actPath.first_site.id);
      } else {
        this.sites.push(actPath.first_site.id);
        if (x === this.paths.length - 1 ) this.sites.push(actPath.end_site.id);
      }
    } else if ((prePath.end_site.id === actPath.first_site.id) || (prePath.end_site.id === actPath.end_site.id)) {
      if (this.sites.length === 0){
        // Només pot passar la primer vegada
        this.sites.push(prePath.first_site.id);
      }
      if(prePath.end_site.id === actPath.end_site.id) {
        this.sites.push(actPath.end_site.id);
        if (x === this.paths.length - 1 ) this.sites.push(actPath.first_site.id);
      } else {
        this.sites.push(actPath.first_site.id);
        if (x === this.paths.length - 1 ) this.sites.push(actPath.end_site.id);
      }
    } else {
      console.log("ERROR: Dos paths que no tene sits ens comú.");
      console.log(this);
    }
    prePath = actPath;
  }
};

Fiber.prototype.getAllDots = function () { // TODO: Repassar
  let that = this;

  let dots = [];
  for (let x = 0; x < this.paths.length; x++){
    var actPath = this.map_parent.getPath(this.paths[x]);
    // Si el primer site del path actual, no és el site per numero
    // que toca s'han de guardar els punts al reves
    if (actPath.first_site.id === this.sites[x]) {
      dots.push([actPath.first_site.latitude, actPath.first_site.longitude])
      for (let y = 0; y < actPath.intermedial.length; y++){
        let actDot = actPath.intermedial[y];
        if (dots.length == 0){
          dots.push(actDot);
        } else {
          // Mirem que no hi hagi el punt repetit!!
          let beforeDot = dots[dots.length - 1];
          if ((beforeDot[0] != actDot[0]) || (beforeDot[1] != actDot[1])) {
            dots.push(actDot);
          }
        }
      }
      dots.push([actPath.end_site.latitude, actPath.end_site.longitude])
    } else {
      dots.push([actPath.end_site.latitude, actPath.end_site.longitude])
      for (let y = actPath.intermedial.length - 1; y >= 0; y--) {
        var actDot = actPath.intermedial[y];
        if (dots.length == 0){
          dots.push(actDot);
        } else {
          // Mirem que no hi hagi el punt repetit!!
          let beforeDot = dots[dots.length - 1];
          if ((beforeDot[0] != actDot[0]) || (beforeDot[1] != actDot[1])) {
            dots.push(actDot);
          }
        }
      }
      dots.push([actPath.first_site.latitude, actPath.first_site.longitude]) // Inversed
    }
  }
  return dots;
};

Fiber.prototype.attachToPath = function () {
  for (let x in this.paths) {
    let path = this.map_parent.getPath(this.paths[x].id || this.paths[x]) // Data model change
    path.drawCable(this.id)
  }
}

Fiber.prototype.addPath = function (path) {
  if (!this.end_site){
    if(this.first_site) {
      console.log(path);
      this.paths.push(path);
      let pathInstance = this.map_parent.getPath(path)
      pathInstance.changeTypePath('fiber')
    } else {
      console.log("Els trams comencen a una caixa.");
    }
  } else {
    console.log("Aquest tram ja està tancat.");
  }
};
Fiber.prototype.addSite = function (site){
  var countBox = site.countBox();
  var lastSiteInFiber = this.sites[this.sites.length - 1];
  // Comprovar si existeix un path entre aquest dos sites!
  var pathBetween = this.map_parent.getPathBeetwenSites(lastSiteInFiber, site.id);

  // No  hi ha path entre aquest dos i no estem dient que ja estem a l'últim site!
  if ((!pathBetween)  && (lastSiteInFiber != site.id)) {
      console.log("Aquest site no està seguit de l'altre!!!");
      return;
  }
  if ((countBox > 0 ) && (lastSiteInFiber == site.id)){
    // Sí, és el final
    console.log('Tancar fibra.');
    this.setEndSite(site);
  } else {
    // No, només pot ser un intermig
    console.log('Intermedial site!');
    this.addPath(pathBetween);
    this.sites.push(site.id);
  }
};
Fiber.prototype.save = function (){
  let cable = {
    project: this.map_parent.active_project.id,
    name: this.name,
    first: this.first_site,
    last: this.end_site,
    status: this.status,
    intermedial: this.paths
  }

  this.map_parent.vue.$store.dispatch('projects/addNewCable', cable).then(response => {
    this.id = response.body.id
    this.map_parent.active_fiber = null
    this.changeSiteColor()
    this.attachToPath()
  }, error => {
    this.clear()
    this.changeSiteColor()
    this.map_parent.deleteFiberById(this.id)
    alert("There was a problem. Please, try again.")
    console.log(error)
  })
}


Fiber.prototype.onFiberClick = function(e){
  var that = this;
  this.editForm();
};
Fiber.prototype.onFiberMouseOver = function(e) {
  if (this.map_parent.status != 'box') {
    this.map_parent.info.update('Fibra ' + this.name + '(' + this.id + ')');
    this.changeTypeFiber('over');
  }
};
Fiber.prototype.onFiberMouseOut = function(e) {
  if (this.map_parent.status != 'box') {
    this.map_parent.info.update('');
    this.changeTypeFiber('active');
  }
};

Fiber.prototype.distance = function (){
  var metros_totales_ruta = 0;
  var coordenadas_iniciales = null;
  var array_coordenadas_polilinea = this.polyline._latlngs;

  for (i = 0; i < array_coordenadas_polilinea.length - 1; i++) {
      coordenadas_iniciales = array_coordenadas_polilinea[i];
      metros_totales_ruta  += coordenadas_iniciales.distanceTo(array_coordenadas_polilinea[i + 1]);
  }
  metros_totales_ruta = metros_totales_ruta.toFixed();
  return metros_totales_ruta;
};
Fiber.prototype.getSegment = function (e){
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
console.log("");
};

Fiber.prototype.changeSiteColor = function () {
  for (let x in this.sites) {
    let site = this.map_parent.getSite(this.sites[x])
    site.endFiberDeployment()
  }
}

export default Fiber
