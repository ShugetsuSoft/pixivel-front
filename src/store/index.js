import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import Pic from "./modules/pic.js";
import CancelRequests from "./modules/cancelRequests";
import Settings from "./modules/settings";

const store = new Vuex.Store({
  modules: {
    Pic,
    CancelRequests,
    Settings,
  },
});

export default store;
