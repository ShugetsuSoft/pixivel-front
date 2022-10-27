import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import Pic from "./modules/pic.js";
import CancelRequests from "./modules/cancelRequests";
import Settings from "./modules/settings";
import Cache from "@/store/modules/cache";

const store = new Vuex.Store({
  modules: {
    Pic,
    CancelRequests,
    Settings,
    Cache,
  },
});

export default store;
