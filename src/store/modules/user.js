// store/modules/user.js
export const state = () => ({
    userInfo: null
  });
  
  export const mutations = {
    SET_USER_INFO(state, payload) {
      state.userInfo = payload;
    }
  };
  
  export const actions = {
    setUserInfo({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo);
    }
  };
  