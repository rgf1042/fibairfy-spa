import VueResource from 'vue-resource';
import Vue from 'vue';
import InitialStates from '../../initial-states.js';

Vue.use(VueResource);

/* eslint-disable */
export default {
    state: InitialStates.paths(),
    getters: {
        findPathById: state => id => {
            return state.paths.find(item => item.id === id);
        },
        findPathIndexById: state => id => {
            return state.paths.findIndex(item => item.id === id);
        },
    },
    mutations: {
        addNewPath(state, path) {
            state.paths.push(path);
        },
        updatePath(state, data) {
            state.paths[data.index] = data.path;
        },
        deletePath(state, index) {
            state.paths.splice(index, 1);
        },
        loadPathArray(state, paths) {
            state.paths = paths;
        },
        resetPaths(state) {
            state.paths = InitialStates.paths().paths;
            state.types = InitialStates.paths().types;
        },
    },
    actions: {
        loadPaths(context) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                context.commit('resetPaths');
                Vue.http
                    .get(
                        baseUrl +
                            '/path/?project=' +
                            context.getters.currentId +
                            '&limit=1000000',
                        { params: { populate: 'first,last' } }
                    )
                    .then(
                        response => {
                            context.commit('loadPathArray', response.body);
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        addNewPath(context, path) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                Vue.http
                    .post(
                        baseUrl +
                            '/path/',
                        path
                    )
                    .then(
                        response => {
                            Vue.http
                                .get(
                                    baseUrl +
                                        '/path/' +
                                        response.body.id,
                                    { params: { populate: 'first,last' } }
                                )
                                .then(
                                    response => {
                                        context.commit(
                                            'addNewPath',
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
        deletePath(context, id) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                let index = context.getters.findPathIndexById(id);
                if (index !== -1) {
                    Vue.http
                        .delete(
                            baseUrl +
                                '/path/' +
                                id
                        )
                        .then(
                            response => {
                                context.commit('deletePath', index);
                                resolve(response);
                            },
                            error => {
                                reject(error);
                            }
                        );
                } else {
                    reject({ msg: 'This path doesnt exist' });
                }
            });
        },
        updatePath(context, path) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                let index = context.getters.findPathIndexById(path.id);
                if (index !== -1) {
                    Vue.http
                        .put(
                            baseUrl +
                                '/path/' +
                                path.id,
                            path
                        )
                        .then(
                            response => {
                                Vue.http
                                    .get(
                                        baseUrl +
                                            '/path/' +
                                            response.body.id,
                                        { params: { populate: 'first,last' } }
                                    )
                                    .then(
                                        response => {
                                            context.commit('updatePath', {
                                                index: index,
                                                path: response.body,
                                            });
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
                } else {
                    reject({ msg: 'This path doesnt exist' });
                }
            });
        },
        findPathById(context, id) {
            return new Promise((resolve, reject) => {
                resolve(context.getters.findPathById(id));
            });
        },
    },
};
