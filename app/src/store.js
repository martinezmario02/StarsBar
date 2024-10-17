import { createStore } from 'vuex';

const store = createStore({
  state: {
    userId: null,
    rol: null
  },
  mutations: {
    setUserId(state, { userId, rol }) { 
      state.userId = userId;
      state.rol = rol;
    },
    clearUserId(state) {
      state.userId = null;
      state.rol = null; 
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
    isAdmin(state){
      console.log('Rol del usuario:', state.rol);
      console.log('id del usuario:', state.id);
      return state.rol === 'admin';
    }
  },
});

export default store;
