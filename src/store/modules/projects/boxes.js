import VueResource from 'vue-resource';
import Vue from 'vue';
import InitialStates from '../../initial-states.js';

Vue.use(VueResource);

/* eslint-disable */
export default {
    state: InitialStates.boxes(),
    getters: {
        boxesIndexes: state => idSite => {
            return state.sites[idSite];
        },
        findBoxById: state => id => {
            return state.boxes[id];
        },
    },
    mutations: {
        addNewBox(state, box) {
            Vue.set(state.boxes, box.id, box);
            // Vue.set(state.sites[box.site], box.id)
            state.sites[box.site].push(box.id); // We push index in sites to boxes array
        },
        addSiteToBox(state, site) {
            // We load this every time a new Site is created
            Vue.set(state.sites, site.id, []);
        },
        updateBox(state, data) {
            Vue.set(state.boxes, data.id, data.box);
        },
        deleteBox(state, id) {
            let idSite = state.boxes[id].site;
            let boxes = state.sites[idSite];
            for (let x in boxes) {
                if (boxes[x] === id) {
                    boxes.splice(x, 1);
                    break;
                }
            }
            Vue.delete(state.boxes, id);
        },
        resetBoxes(state) {
            state.boxes = InitialStates.boxes().boxes;
            state.sites = InitialStates.boxes().sites;
            state.types = InitialStates.boxes().types;
        },
    },
    actions: {
        loadBoxes(context) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                context.commit('resetBoxes');
                let sites = context.getters.sites; // We load existing sites
                for (let x in sites) context.commit('addSiteToBox', sites[x]);
                Vue.http
                    .get(
                        baseUrl +
                            '/box/?project=' +
                            context.getters.currentId +
                            '&limit=10000'
                    )
                    .then(
                        response => {
                            for (let x in response.body) {
                                let box = response.body[x];
                                context.commit('addNewBox', box);
                            }
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        addNewBox(context, box) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                Vue.http
                    .post(
                        baseUrl +
                            '/box/',
                        box
                    )
                    .then(
                        response => {
                            Vue.http
                                .get(
                                    baseUrl +
                                        '/box/' +
                                        response.body.id
                                )
                                .then(
                                    response => {
                                        context.commit(
                                            'addNewBox',
                                            response.body
                                        );
                                        resolve(response);
                                    },
                                    error => {
                                        reject(error);
                                    }
                                );
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        deleteBox(context, id) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                Vue.http
                    .delete(
                        baseUrl +
                            '/box/' +
                            id
                    )
                    .then(
                        response => {
                            context.commit('deleteBox', id);
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        updateBox(context, box) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                Vue.http
                    .put(
                        baseUrl +
                            '/box/' +
                            box.id,
                        box
                    )
                    .then(
                        response => {
                            context.commit('updateBox', {
                                id: box.id,
                                box: response.body,
                            });
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
