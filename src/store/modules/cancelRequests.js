const state = {
  cancelTokens: []
}

const mutations = {
  addCancelToken(state, token) {
    state.cancelTokens.push(token)
  },
  clearCancelToken(state) {
    state.cancelTokens.forEach((cancel) => {
      cancel()
    })
    state.cancelTokens = []
  }
}

export default {
  namespaced: true,
  state,
  mutations
}