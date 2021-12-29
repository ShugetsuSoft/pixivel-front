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
	},
	{
		path: "/illustrator/:id",
		name: "User",
		component: () => import("@/views/User.vue"),
	},
	{
		path: "/search",
		name: "Search",
		component: () => import("@/views/Search.vue"),
	},
	{
		path: "/rank",
		name: "Rank",
		component: () => import("@/views/Rank.vue"),
	}
];

const scrollBehavior = (to, from, savedPosition) =>
{
	if (savedPosition) {
		console.log("return")
		return savedPosition
	} else {
		return { x: 0, y: 0 }
	}
}

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
	scrollBehavior
});

export default router;
