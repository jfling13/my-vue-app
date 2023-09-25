// store/index.js
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  plugins: [createPersistedState()],
  state() {
    return {
      user: null, // 用户信息
    };
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
  },
});
