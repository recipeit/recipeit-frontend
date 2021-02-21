export default {
  namespaced: true,
  state: {
    userProfile: null
  },
  mutations: {
    SET_USER_PROFILE(state, profile) {
      // console.log('SET_USER_PROFILE')
      state.userProfile = profile
    }
  },
  actions: {
    setUserProfile({ commit }, profile) {
      // console.log('setUserProfile')
      commit('SET_USER_PROFILE', profile)
    }
  }
}
