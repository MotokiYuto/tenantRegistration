import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    decodedToken: null,
    token: null,
  },
  mutations: {
    setDecodeToken (state, payload) {
      state.decodedToken = payload
    },
    setToken (state, payload) {
      state.token = payload
    },
  },
  actions: {
    getDecodedToken ({ commit }, decodeToken) {
      commit('setDecodeToken', decodeToken)
    },
    getToken ({ commit }, token) {
      commit('setToken', token)
    },
  },
  modules: {
  }
})
