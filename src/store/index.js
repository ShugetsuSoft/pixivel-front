import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Pic from './modules/pic.js'

const store = new Vuex.Store({
	modules: {
		Pic
	}
})

export default store
