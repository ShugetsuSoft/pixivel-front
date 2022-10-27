import LRUCache from "lru-cache";
import qs from "qs";

const options = {
  max: 500,

  ttl: 1000 * 60 * 5,

  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

const state = {
  cache: new LRUCache(options),
};

const mutations = {
  cacheState(state, object) {
    state.cache.set(qs.stringify(object["key"]), object["val"]);
  },
};

const getters = {
  get: (state) => (key, defaultVal) => {
    return state.cache.get(qs.stringify(key)) || defaultVal;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
