import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { getNetwork } from '@/utils/chain'
import { CHAIN_ID } from '@/constants'
import store from '@/store'
import storage from 'store'
import { WEB3_ADDRESS } from '@/store/mutation-types'

const INFURA_ID = '' // '3cf2b1ad66f842fd9b45cbd51f945b84';

// 监听钱包事件 OK
async function subscribeProvider (provider, web3, web3Modal) {
  if (!provider.on) {
    return
  }
  provider.on('accountsChanged', async (accounts) => {
    storage.remove(WEB3_ADDRESS)
    if (accounts[0]) {
      storage.set(WEB3_ADDRESS, accounts[0])
    } else {
      window.location.reload()
    }
    store.dispatch('changeAddress', accounts[0])
  })
  provider.on('chainChanged', () => {
    window.location.reload()
  })
  provider.on('connect', (info) => {
    console.log(info)
  })
  provider.on('disconnect', async () => {
    storage.remove(WEB3_ADDRESS)
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close()
    }
    web3Modal.clearCachedProvider()
    window.location.reload()
  })
}

// 获取Provider配置 OK
function getProviderOptions () {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: INFURA_ID
      }
    }
  }
  return providerOptions
}

// 初始化web3 OK
function initWeb3 (provider) {
  const web3 = new Web3(provider)

  // web3.eth.extend({
  //   methods: [
  //     {
  //       name: 'chainId',
  //       call: 'eth_chainId',
  //       outputFormatter: web3.utils.hexToNumber
  //     }
  //   ]
  // })

  return web3
}

// 实例化Web3Modal
function getWeb3Modal () {
  return new Web3Modal({
    network: getNetwork(CHAIN_ID),
    cacheProvider: true,
    providerOptions: getProviderOptions()
  })
}

/**
 * 初始化 web3
 * @returns new Web3
 */
export async function initConnect () {
  const web3Modal = getWeb3Modal()
  const provider = await web3Modal.connect()
  const web3 = initWeb3(provider)
  await subscribeProvider(provider, web3, web3Modal)
  const accounts = await web3.eth.getAccounts()
  const account = toChecksumAddress(accounts[0])
  return {
    web3,
    web3Modal,
    account
  }
}

/**
 * 格式化Token
 * @returns token
 */
export function toChecksumAddress (token) {
  return Web3.utils.toChecksumAddress(token)
}

/**
 * 检查Token
 * @returns token
 */
export function checkAddressChecksum (token) {
  return Web3.utils.checkAddressChecksum(token)
}

/**
 * 获取合约
 * @returns contract
 */
export function getContract (contractJson, token, web3) {
  return getContractByABI(contractJson.abi, token, web3)
}

/**
 * 获取合约
 * @returns contract
 */
export function getContractByABI (contractABI, token, web3) {
  if (!token) {
    return new web3.eth.Contract(contractABI)
  } else {
    return new web3.eth.Contract(contractABI, toChecksumAddress(token))
  }
}

/**
 * 格式化Wei To Ether
 * @returns etherValue
 */
export function weiToEther (amount, web3) {
  return web3.utils.fromWei(amount, 'ether')
}

/**
 * 格式化Ether To Wei
 * @returns weiValue
 */
export function etherToWei (amount, web3) {
  return web3.utils.toWei(amount.toString(), 'ether')
}
