import Vue from "vue";
import App from "@/App.vue";

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
import 'boxicons/css/boxicons.css'

import router from "@/router"
Vue.config.productionTip = false;

Vue.use(Vuesax, {
	colors: {
	}
})

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
