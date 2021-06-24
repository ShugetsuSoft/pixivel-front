import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Landing",
		component: () => import("@/views/Landing.vue"),
	},
	{
		path: "/illust/:id",
		name: "Detail",
		component: () => import("@/views/Detail.vue"),
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
