import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
// import permission from './modules/permission'

// dynamic router permission control (Experimental)
import permission from './modules/async-router'
import getters from './getters'

// import web3
import web3 from './modules/web3'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    web3
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
