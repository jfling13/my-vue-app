import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    fetchUser({ commit }, user) {
      // 模拟API调用，然后设置用户
      commit('setUser', user);
    },
  },
});

export default store;
