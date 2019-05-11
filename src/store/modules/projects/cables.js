import VueResource from 'vue-resource';
import Vue from 'vue';
import InitialStates from '../../initial-states.js';

Vue.use(VueResource);

/* eslint-disable */
export default {
    state: InitialStates.cables(),
    getters: {
        cablesIndexes: state => idSite => {
            return state.sites[idSite];
        },
        findCableById: state => id => {
            return state.cables[id];
        },
    },
    mutations: {
        addNewCable(state, cable) {
            Vue.set(state.cables, cable.id, cable);
            if (typeof state.sites[cable.first] == 'undefined') {
                Vue.set(state.sites, cable.first, []);
            }
            if (typeof state.sites[cable.last] == 'undefined') {
                Vue.set(state.sites, cable.last, []);
            }
            state.sites[cable.first].push(cable.id);
            state.sites[cable.last].push(cable.id);
        },
        updateCable(state, cable) {
            Vue.set(state.cables, cable.id, cable);
        },
        deleteCable(state, id) {
            let idsSites = [state.cables[id].first, state.cables[id].last];
            for (let x in idsSites) {
                let cables = state.sites[idsSites[x]];
                for (let y in cables) {
                    if (cables[y] === id) {
                        cables.splice(y, 1);
                        break;
                    }
                }
            }
            Vue.delete(state.cables, id);
        },
        resetCables(state) {
            state.cables = InitialStates.cables().cables;
            state.sites = InitialStates.cables().sites;
        },
    },
    actions: {
        loadCables(context) {
            return new Promise((resolve, reject) => {
                context.commit('resetCables');
                Vue.http
                    .get(
                        fiberfy.constants.BASE_URL +
                            fiberfy.constants.API_VERSION +
                            '/cable/?project=' +
                            context.getters.currentId +
                            '&limit=1000000' +
                            '&populate=intermedial'
                    )
                    .then(
                        response => {
                            for (let x in response.body) {
                                let cable = response.body[x];
                                context.commit('addNewCable', cable);
                            }
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        addNewCable(context, cable) {
            return new Promise((resolve, reject) => {
                Vue.http
                    .post(
                        fiberfy.constants.BASE_URL +
                            fiberfy.constants.API_VERSION +
                            '/cable/',
                        cable
                    )
                    .then(
                        response => {
                            Vue.http
                                .get(
                                    fiberfy.constants.BASE_URL +
                                        fiberfy.constants.API_VERSION +
                                        '/cable/' +
                                        response.body.id,
                                    { params: { populate: 'intermedial' } }
                                )
                                .then(
                                    response => {
                                        context.commit(
                                            'addNewCable',
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
        deleteCable(context, id) {
            return new Promise((resolve, reject) => {
                Vue.http
                    .delete(
                        fiberfy.constants.BASE_URL +
                            fiberfy.constants.API_VERSION +
                            '/cable/' +
                            id
                    )
                    .then(
                        response => {
                            context.commit('deleteCable', id);
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        updateCable(context, cable) {
            return new Promise((resolve, reject) => {
                Vue.http
                    .put(
                        fiberfy.constants.BASE_URL +
                            fiberfy.constants.API_VERSION +
                            '/cable/' +
                            cable.id,
                        cable
                    )
                    .then(
                        response => {
                            Vue.http
                                .get(
                                    fiberfy.constants.BASE_URL +
                                        fiberfy.constants.API_VERSION +
                                        '/cable/' +
                                        response.body.id,
                                    { params: { populate: 'intermedial' } }
                                )
                                .then(
                                    response => {
                                        context.commit(
                                            'updateCable',
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
        setCableTemplate(context, data) {
            return new Promise((resolve, reject) => {
                context.dispatch('clearTubesCable', data.cable).then(
                    response => {
                        // Now we should create new tubes/fibers
                        let template = context.rootGetters[
                            'templates/findFiberTemplateById'
                        ](data.template).data;
                        let project = context.getters['currentId'];
                        let tubePromises = [];
                        for (let x in template) {
                            let tube = {};
                            tube.color = template[x].color;
                            tube.cable = data.cable;
                            tube.project = project;
                            tubePromises.push(
                                context.dispatch('addNewTube', tube)
                            );
                        }
                        Promise.all(tubePromises).then(
                            response => {
                                let fiberPromises = [];
                                for (let x in response) {
                                    for (let key in template[x].fibers) {
                                        if (
                                            template[x].fibers.hasOwnProperty(
                                                key
                                            )
                                        ) {
                                            let fiberTemplate =
                                                template[x].fibers[key];
                                            let fiber = {};
                                            fiber.color = fiberTemplate.color;
                                            fiber.tube = response[x].body.id;
                                            fiber.project = project;
                                            fiberPromises.push(
                                                context.dispatch(
                                                    'addNewFiber',
                                                    fiber
                                                )
                                            );
                                        }
                                    }
                                }

                                Promise.all(fiberPromises).then(
                                    response => {
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
                    },
                    error => {
                        reject(error);
                    }
                );
            });
        },
    },
};
