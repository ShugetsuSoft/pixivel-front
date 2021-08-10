import Vue from "vue";
import App from "@/App.vue";

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import axios from "axios";
import VueAxios from "vue-axios";
import VirtualMasonry from 'vue-virtual-masonry'
import InfiniteLoading from 'vue-infinite-loading'

import "@mdi/font/css/materialdesignicons.min.css"

import router from "@/router"
Vue.config.productionTip = false;

import ImgReso from '@/utils/ImgReso'
import Store from '@/store'

Vue.use(Buefy)
Vue.use(VueAxios, axios)
Vue.use(ImgReso)
Vue.use(VirtualMasonry, {
	additionalDistance: 1000,
})
Vue.use(InfiniteLoading)

new Vue({
	router,
	render: (h) => h(App),
	store: Store,
}).$mount("#app");
