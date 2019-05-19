import VueResource from 'vue-resource';
import Vue from 'vue';
import InitialStates from '../../initial-states.js';

Vue.use(VueResource);

/* eslint-disable */
export default {
    state: InitialStates.sites(),
    getters: {
        findSiteById: state => id => {
            return state.sites.find(item => item.id === id);
        },
        findSiteIndexById: state => id => {
            return state.sites.findIndex(item => item.id === id);
        },
        sites: state => {
            return state.sites;
        },
    },
    mutations: {
        addNewSite(state, site) {
            state.sites.push(site);
        },
        updateSite(state, data) {
            state.sites[data.index] = data.site;
        },
        deleteSite(state, index) {
            state.sites.splice(index, 1);
        },
        loadSiteArray(state, sites) {
            state.sites = sites;
        },
        resetSites(state) {
            state.sites = InitialStates.sites().sites;
            state.types = InitialStates.sites().types;
        },
    },
    actions: {
        loadSites(context) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                context.commit('resetSites');
                Vue.http
                    .get(
                        baseUrl +
                            '/site/?project=' +
                            context.getters.currentId +
                            '&limit=1000000'
                    )
                    .then(
                        response => {
                            context.commit('loadSiteArray', response.body);
                            resolve(response);
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        },
        addNewSite(context, site) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                Vue.http
                    .post(
                        baseUrl +
                            '/site/',
                        site
                    )
                    .then(
                        response => {
                            Vue.http
                                .get(
                                    baseUrl +
                                        '/site/' +
                                        response.body.id
                                )
                                .then(
                                    response => {
                                        context.commit(
                                            'addNewSite',
                                            response.body
                                        );
                                        context.commit(
                                            'addSiteToBox',
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
        deleteSite(context, id) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                let index = context.getters.findSiteIndexById(id);
                if (index !== -1) {
                    Vue.http
                        .get(
                            baseUrl +
                                '/path/',
                            {
                                params: {
                                    where: {
                                        or: [{ first: id }, { last: id }],
                                    },
                                },
                            }
                        )
                        .then(
                            response => {
                                let paths = response.body;
                                Vue.http
                                    .delete(
                                        baseUrl +
                                            '/site/' +
                                            id
                                    )
                                    .then(
                                        response => {
                                            for (let x in paths) {
                                                let index = context.getters.findPathIndexById(
                                                    paths[x].id
                                                );
                                                context.commit(
                                                    'deletePath',
                                                    index
                                                );
                                            }
                                            context.commit('deleteSite', index);
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
                    reject({ msg: 'This site doesnt exist' });
                }
            });
        },
        updateSite(context, site) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                let index = context.getters.findSiteIndexById(site.id);
                if (index !== -1) {
                    Vue.http
                        .put(
                            baseUrl +
                                '/site/' +
                                site.id,
                            site
                        )
                        .then(
                            response => {
                                context.commit('updateSite', {
                                    index: index,
                                    site: response.body,
                                });
                                resolve(response);
                            },
                            error => {
                                reject(error);
                            }
                        );
                } else {
                    reject({ msg: 'This site doesnt exist' });
                }
            });
        },
        findSiteById(context, id) {
            return new Promise((resolve, reject) => {
                resolve(context.getters.findSiteById(id));
            });
        },
    },
};
