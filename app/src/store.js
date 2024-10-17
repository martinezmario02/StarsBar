import { createStore } from 'vuex';

const store = createStore({
  state: {
    userId: null,
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
    clearUserId(state) {
      state.userId = null;
    },
  },
  actions: {
    login({ commit }, userId) {
      commit('setUserId', userId);
    },
    logout({ commit }) {
      commit('clearUserId');
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.userId;
    },
  },
});

export default store;
