import VueResource from 'vue-resource';
import Vue from 'vue';
import InitialStates from '../../initial-states.js';

Vue.use(VueResource);

/* eslint-disable */
export default {
    state: InitialStates.fibers(),
    getters: {
        fibersIndexes: state => idTube => {
            return state.tubes[idTube];
        },
        findFiberById: state => id => {
            return state.fibers[id];
        },
    },
    mutations: {
        addNewFiber(state, fiber) {
            Vue.set(state.fibers, fiber.id, fiber);
            Vue.set(state.tubes, fiber.tube, state.tubes[fiber.tube] || []);
            state.tubes[fiber.tube].push(fiber.id); // We push index in tubes to fibers array
        },
        addCableToFiber(state, tube) {
            Vue.set(state.tubes, tube.id, []);
        },
        updateFiber(state, data) {
            Vue.set(state.fibers, data.id, data.fiber);
        },
        deleteFiber(state, id) {
            let idCable = state.fibers[id].tube;
            let fibers = state.tubes[idCable];
            for (let x in fibers) {
                if (fibers[x] === id) {
                    fibers.splice(x, 1);
                    break;
                }
            }
            Vue.delete(state.fibers, id);
        },
        resetFibers(state) {
            state.fibers = InitialStates.fibers().fibers;
            state.tubes = InitialStates.fibers().tubes;
        },
    },
    actions: {
        loadFibers(context) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                context.commit('resetFibers');
                let tubes = context.getters.tubes; // We load existing tubes
                for (let x in tubes) context.commit('addSiteToFiber', tubes[x]);
                Vue.http
                    .get(
                        baseUrl +
                            '/fiber/?project=' +
                            context.getters.currentId +
                            '&limit=10000'
                    )
                    .then(
                        response => {
                            for (let x in response.body) {
                                let fiber = response.body[x];
                                context.commit('addNewFiber', fiber);
                            }
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        addNewFiber(context, fiber) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                Vue.http
                    .post(
                        baseUrl +
                            '/fiber/',
                        fiber
                    )
                    .then(
                        response => {
                            Vue.http
                                .get(
                                    baseUrl +
                                        '/fiber/' +
                                        response.body.id
                                )
                                .then(
                                    response => {
                                        context.commit(
                                            'addNewFiber',
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
        deleteFiber(context, id) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                Vue.http
                    .delete(
                        baseUrl +
                            '/fiber/' +
                            id
                    )
                    .then(
                        response => {
                            context.commit('deleteFiber', id);
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        updateFiber(context, fiber) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                Vue.http
                    .put(
                        baseUrl +
                            '/fiber/' +
                            fiber.id,
                        fiber
                    )
                    .then(
                        response => {
                            context.commit('updateFiber', {
                                id: fiber.id,
                                fiber: response.body,
                            });
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        clearFibersTube(context, tube) {
            return new Promise((resolve, reject) => {
                let fibers = context.getters.fibersIndexes(tube);
                let promises = [];
                for (let x in fibers) {
                    promises.push(context.dispatch('deleteFiber', fibers[x]));
                }
                Promise.all(promises).then(
                    response => {
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
