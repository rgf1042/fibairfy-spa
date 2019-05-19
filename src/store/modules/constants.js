import VueResource from 'vue-resource';
import Vue from 'vue';
import InitialStates from '../initial-states.js';

Vue.use(VueResource);

/* eslint-disable */
export default {
    namespaced: true,
    state: InitialStates.user(),
    mutations: {
        SET_CONSTANTS(state, constants) {
          state.constants = constants;
        }
    },
    getters: {
        constants: state => {
            return state.constants;
        },
    },
    actions: {
       setConstants(context, constants) {
          context.commit('SET_CONSTANTS', constants);
       }
    },
};
/* eslint-enable */
