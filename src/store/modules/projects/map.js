import VueResource from 'vue-resource';
import Vue from 'vue';

import InitialStates from '../../initial-states.js';

Vue.use(VueResource);

/* eslint-disable */
export default {
    namespaced: true,
    state: InitialStates.map(),
    getters: {
        currentLocation: state => {
            return {
                latitude: state.latitude,
                longitude: state.longitude,
                zoom: state.zoom,
            };
        },
        currentLayer: state => {
            return state.layer;
        },
        baseLayers: state => {
            return state.base;
        },
        overlayLayers: state => {
            return state.base;
        },
    },
    mutations: {
        setLatitude(state, latitude) {
            state.latitude = latitude;
        },
        setLongitude(state, longitude) {
            state.longitude = longitude;
        },
        setZoom(state, zoom) {
            state.zoom = zoom;
        },
        setLayer(state, layer) {
            state.layer = layer;
        },
        setSelectedBaseTile(state, base) {
            state.selectedBaseTile = base;
            state.baseSelected = 'tiles';
        },
        setSelectedBaseWMS(state, base) {
            state.selectedBaseWMS = base;
            state.baseSelected = 'wms';
        },
        addSelectedOverlayTile(state, overlay) {
            state.selectedOverlayTiles.push(overlay);
        },
        removeSelectedOverlayTile(state, overlay) {
            let index = state.selectedOverlayTiles.findIndex(function(e) {
                return e === overlay;
            });
            state.selectedOverlayTiles.splice(index, 1);
        },
        addNewBaseLayerTiles(state, layer) {
            state.base.tiles.push(layer);
        },
        addNewBaseLayerWMS(state, layer) {
            state.base.wms.push(layer);
        },
        addNewOverlayLayerWMS(state, layer) {
            state.overlay.wms.push(layer);
        },
        reset(state) {
            (state.latitude = InitialStates.map().latitude),
                (state.longitude = InitialStates.map().longitude),
                (state.zoom = InitialStates.map().zoom);
            state.layer = InitialStates.map().layer;
            state.base = InitialStates.map().base;
            state.overlay = InitialStates.map().overlay;
            state.selectedBaseWMS = InitialStates.map().selectedBaseWMS;
            state.selectedBaseTile = InitialStates.map().selectedBaseTile;
            state.baseSelected = InitialStates.map().baseSelected;
        },
    },
    actions: {
        setLocation(context, location) {
            context.commit('setLatitude', location.latitude);
            context.commit('setLongitude', location.longitude);
        },
        setZoom(context, zoom) {
            context.commit('setZoom', zoom);
        },
        setLayer(context, layer) {
            context.commit('setLayer', layer);
        },
        setSelectedBaseTile(context, base) {
            context.commit('setSelectedBaseTile', base);
        },
        addSelectedOverlayTile(context, overlay) {
            context.commit('addSelectedOverlayTile', overlay);
        },
        removeSelectedOverlayTile(context, overlay) {
            context.commit('removeSelectedOverlayTile', overlay);
        },
        getMapLayers(context) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                context.commit('reset');
                Vue.http
                    .get(
                        baseUrl +
                            '/maps/auth'
                    )
                    .then(
                        response => {
                            for (let x in response.body) {
                                let source = response.body[x];
                                for (let y in source.layers) {
                                    let layer = source.layers[y];
                                    let output = {
                                        name: source.name + ' - ' + layer.name,
                                        tiles:
                                            source.url +
                                            (layer.options.path || ''),
                                        options: layer.options,
                                    };
                                    if (source.internal)
                                        output.tiles +=
                                            '?token=' +
                                            context.rootGetters['user/token'];
                                    if (layer.isBase) {
                                        if (source.type === 'tiles')
                                            context.commit(
                                                'addNewBaseLayerTiles',
                                                output
                                            );
                                        else if (source.type === 'wms') {
                                            context.commit(
                                                'addNewBaseLayerWMS',
                                                output
                                            );
                                        }
                                    } else if (
                                        !layer.isBase &&
                                        source.type === 'wms'
                                    ) {
                                        context.commit(
                                            'addNewOverlayLayerWMS',
                                            output
                                        );
                                    }
                                }
                            }
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
    },
};
