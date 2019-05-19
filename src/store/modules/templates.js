import VueResource from 'vue-resource';
import Vue from 'vue';
import InitialStates from '../initial-states.js';

Vue.use(VueResource);

/* eslint-disable */
export default {
    namespaced: true,
    state: InitialStates.templates(),
    mutations: {
        setFiberTemplates(state, templates) {
            state.fiberTemplates = templates;
        },
        reset(state) {
            state.fiberTemplates = InitialStates.templates().fiberTemplates;
            state.fiberTemplates = InitialStates.templates().statusList;
        },
    },
    getters: {
        findFiberTemplateById: state => id => {
            return state.fiberTemplates.find(item => item.id === id);
        },
    },
    actions: {
        loadFiberTemplates(context) {
            return new Promise((resolve, reject) => {
                const baseUrl = context.rootGetters['constants/constants']['baseUrl'];
                Vue.http
                    .get(
                        baseUrl +
                            '/fibertemplate/?limit=1000000'
                    )
                    .then(
                        response => {
                            context.commit('setFiberTemplates', response.body);
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
/* eslint-enable */
