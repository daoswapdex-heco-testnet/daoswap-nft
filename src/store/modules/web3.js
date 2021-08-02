import storage from 'store'
import { WEB3_ADDRESS } from '@/store/mutation-types'
import { initConnect, toChecksumAddress } from '@/utils/web3'
import { CHAIN_ID, NETWORK_ID } from '@/constants'

const web3 = {
  state: {
    web3: null,
    address: '',
    web3Modal: undefined,
    provider: undefined,
    connected: false,
    chainId: CHAIN_ID,
    networkId: NETWORK_ID
  },

  mutations: {
    SET_WEB3: (state, web3) => {
      state.web3 = web3
    },
    SET_WEB3MODAL: (state, web3Modal) => {
      state.web3Modal = web3Modal
    },
    SET_ADDRESS: (state, account) => {
      state.address = account
    },
    SET_PROVIDER: (state, provider) => {
      state.provider = provider
    },
    SET_CONNECTED: (state, connected) => {
      state.connected = connected
    },
    SET_CHAINID: (state, chainId, networkId) => {
      state.chainId = chainId
      state.networkId = networkId
    }
  },

  actions: {
    // 连接钱包
    async connectWallet ({ commit }) {
      const init = await initConnect()
      storage.set(WEB3_ADDRESS, init.account)
      commit('SET_WEB3', web3)
      commit('SET_WEB3MODAL', init.web3Modal)
      commit('SET_CONNECTED', true)
      commit('SET_ADDRESS', init.account)
      return init
    },
    // 切换网络
    changeWeb3 ({ commit }, web3) {
      commit('SET_WEB3', web3)
    },
    // 切换Web3Modal
    changeWeb3Modal ({ commit }, web3Modal) {
      commit('SET_WEB3MODAL', web3Modal)
    },
    // 切换当前账号
    changeAddress ({ commit }, account) {
      const address = account ? toChecksumAddress(account) : account
      commit('SET_CONNECTED', true)
      commit('SET_ADDRESS', address)
    },
    // 切换Provider
    changeProvider ({ commit }, provider) {
      commit('SET_PROVIDER', provider)
    },
    // 切换连接状态
    changeConnected ({ commit }, connected) {
      commit('SET_CONNECTED', connected)
    },
    // 切换链
    async changeChainId ({ state, commit }, chainId) {
      const networkId = await state.web3.eth.net.getId()
      commit('SET_CHAINID', chainId, networkId)
    },
    // 断开钱包链接
    async closeWallet ({ commit }) {
      storage.remove(WEB3_ADDRESS)
      // 存储全局变量
      commit('SET_WEB3', null)
      commit('SET_WEB3MODAL', null)
      commit('SET_PROVIDER', null)
      commit('SET_CONNECTED', false)
      commit('SET_ADDRESS', '')
    }
  }
}

export default web3
