import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    username: ''
  },
  mutations: {
    login(state, user) {
      state.username = user;
      state.loggedIn = true;
    },
    logout(state) {
      state.username = '';
      state.loggedIn = false;
    }
  },
  actions: {
    login({ commit }, user) {
      commit('login', user);
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    username: state => state.username,
    loggedIn: state => state.loggedIn
  }
});
