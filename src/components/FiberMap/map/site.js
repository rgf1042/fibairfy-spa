/* eslint-disable */
import Path from './path';
import Fiber from './fiber';
import L from 'leaflet';

var uuidv1 = require('uuid/v1');
// =====================
// Site

var Site = function(id, name, latlng, type, zone, m, boxes) {
    this.name = name; // Nom del Lloc
    this.latlng = latlng; // Posició del Lloc
    this.id = id; // Identificador
    this.type = type; // Tipus de lloc
    this.status = 'Planned';
    this.observations = null; // Observacions
    this.marker = null; // Marcador en el mapa
    this.map_parent = m; // referencia al mapa on està
    this.zone = zone; // Zona de guifi (location)

    this.deploying_fibers = false; // Flag to control fiber deployment in map
    this.boxes = boxes; // We set boxes
    this.actualFusionSite = null; // L'última grup de dades d'una fusió
};

Site.prototype.save = function() {
    let site = {
        name: this.name,
        project: this.map_parent.active_project.id,
        latitude: this.latlng.lat,
        longitude: this.latlng.lng,
        type: this.type,
        zone: this.zone,
        status: this.status,
    };
    return new Promise((resolve, reject) => {
        this.map_parent.vue.$store.dispatch('projects/addNewSite', site).then(
            response => {
                this.id = response.body.id;
                resolve(response);
            },
            error => {
                reject(error);
            }
        );
    });
};

Site.prototype.clear = function() {
    if (this.marker) this.map_parent.map.removeLayer(this.marker);
};
Site.prototype.draw = function() {
    var that = this;
    this.marker = L.marker(this.latlng).addTo(that.map_parent.map);
    this.changeTypeIcon();
    if (!this.id)
        this.save().then(
            response => {
                this.setEvents();
            },
            error => {
                this.clear();
                this.map_parent.deleteSiteById(this.id);
                alert('There was a problem. Please, try again.');
                console.log(error);
            }
        );
    else {
        this.setEvents();
    }
};

Site.prototype.setEvents = function() {
    var that = this;
    this.marker
        .on('click', function() {
            return that.onSiteClick();
        })
        .on('mouseover', function() {
            return that.onSiteMouseOver();
        })
        .on('mouseout', function() {
            return that.onSiteMouseOut();
        });
};

Site.prototype.changeTypeIcon = function(status, type) {
    if (!type) {
        type = this.type;
    }
    type = type.toLowerCase();

    var icon;
    switch (status) {
        case 'over':
            icon = this.map_parent.type_site_icon_over[type];
            break;
        case 'active':
            icon = this.map_parent.type_site_icon_active[type];
            break;
        case 'grey':
            icon = this.map_parent.type_site_icon_grey[type];
            break;
        case 'fiber':
            icon = this.map_parent.type_site_icon_fiber[type];
            break;
        default:
            if (this.map_parent.layerActive === 'civil')
                icon = this.map_parent.type_site_icon[type];
            else
                icon =
                    this.countBox() > 0
                        ? this.map_parent.type_site_icon_active[type]
                        : this.map_parent.type_site_icon_grey[type];
    }
    this.marker.setIcon(icon);
};
// Mouse Events
Site.prototype.onSiteMouseOver = function(e) {
    if (this.map_parent.layerActive === 'civil') {
        switch (this.map_parent.status) {
            case 'path':
                this.changeTypeIcon('active');
                break;
            default:
                this.map_parent.info.update(
                    this.map_parent.vue.$t('components.editSites.site') +
                        ': ' +
                        this.name +
                        '(' +
                        this.id +
                        ')'
                );
                this.changeTypeIcon('over');
                break;
        }
    } else if (this.map_parent.layerActive === 'infra') {
        switch (this.map_parent.status) {
            case 'box':
                break;
            case 'fiber':
                if (this.countBox() > 0 && !this.deploying_fibers)
                    this.changeTypeIcon('over');
                break;
        }
    }
};
Site.prototype.onSiteMouseOut = function(e) {
    if (this.map_parent.layerActive === 'civil') {
        switch (this.map_parent.status) {
            case 'path':
                if (
                    (this.map_parent.active_path &&
                        this.map_parent.active_path.first_site &&
                        this.map_parent.active_path.first_site !== this.id) ||
                    !this.map_parent.active_path
                ) {
                    this.changeTypeIcon();
                }
                break;
            case 'fiber':
                if (!this.deploying_fibers) this.showIconBox();
                break;
            default:
                this.map_parent.info.update('');
                this.changeTypeIcon();
                // $('#make_site').text('Crea Lloc');
                break;
        }
    } else if (this.map_parent.layerActive === 'infra') {
        switch (this.map_parent.status) {
            case 'box':
                break;
            case 'fiber':
                if (
                    (this.map_parent.active_fiber &&
                        this.map_parent.active_fiber.first_site &&
                        this.map_parent.active_fiber.first_site !== this.id) ||
                    !this.map_parent.active_fiber
                ) {
                    this.showIconBox();
                }
                break;
        }
    }
};

Site.prototype.onSiteClick = function(e) {
    switch (this.map_parent.status) {
        case 'path':
            // Hi ha algun path actiu?
            if (
                this.map_parent.active_path &&
                this.map_parent.active_path.first_site
            ) {
                // Sí
                console.log('tancar tram.');
                this.map_parent.active_path.setEndSite(this);
                this.map_parent.vue.$emit('active-path', Boolean(false));
            } else {
                // No n'hi ha cap actiu, el creem.
                console.log('inici tram.');
                this.changeTypeIcon('active');
                this.map_parent.active_path = new Path(
                    null,
                    'path-' + uuidv1(),
                    null,
                    null,
                    new Array(),
                    this.map_parent.type_path_default,
                    this.map_parent
                );
                this.map_parent.active_path.setFirstSite(this);
                this.map_parent.vue.$emit('active-path', Boolean(true));
            }
            break;
        case 'split':
            alert('No es pot fer un split a un Lloc!');
            break;
        case 'site':
            // Anem a editar el site
            this.map_parent.vue.$emit('edit-site', Number(this.id));
            break;
        case 'editFusions':
            this.map_parent.vue.$emit('edit-fusions', Number(this.id));
            break;
        case 'fiber':
            // Hi ha alguna fibra activa?
            if (
                this.map_parent.active_fiber &&
                this.map_parent.active_fiber.first_site
            ) {
                // Sí
                this.changeTypeIcon('fiber');
                this.deploying_fibers = true;
                this.map_parent.active_fiber.addSite(this);
            } else {
                // No n'hi ha cap actiu, el creem.
                console.log('inici fibra.');
                this.changeTypeIcon('fiber');
                this.deploying_fibers = true;
                this.map_parent.active_fiber = new Fiber(
                    null,
                    'cable-' + uuidv1(),
                    null,
                    null,
                    new Array(),
                    null,
                    this.map_parent.type_path_default,
                    this.map_parent
                );
                this.map_parent.active_fiber.setFirstSite(this);
            }
            break;
        case '':
            if (this.map_parent.layerActive === 'civil')
                this.map_parent.vue.$emit('edit-site', Number(this.id));
            else this.map_parent.vue.$emit('edit-boxes', Number(this.id));
    }
};

Site.prototype.showIconBox = function() {
    switch (this.map_parent.layerActive) {
        case 'civil':
            this.changeTypeIcon();
            break;
        case 'infra':
            if (!this.deploying_fibers) {
                if (this.countBox() > 0) {
                    this.changeTypeIcon('active');
                } else {
                    this.changeTypeIcon('grey');
                }
            }
            break;
    }
};

Site.prototype.endFiberDeployment = function() {
    this.deploying_fibers = false;
    this.showIconBox();
};

Site.prototype.countBox = function() {
    return this.boxes.length;
};

export default Site;
