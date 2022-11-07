import Vue from "vue";
import VueRouter from "vue-router";

import Landing from "@/views/Landing.vue";
import Detail from "@/views/Detail.vue";
import User from "@/views/User.vue";
import Search from "@/views/Search.vue";
import Rank from "@/views/Rank.vue";
import Account from "@/views/Account.vue";
import oldRedirect from "@/views/oldRedirect.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/illust/:id",
    name: "Detail",
    component: Detail,
  },
  {
    path: "/illustrator/:id",
    name: "User",
    component: User,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
  {
    path: "/rank",
    name: "Rank",
    component: Rank,
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
  },
  {
    path: "/user",
    component: oldRedirect,
  },
  {
    path: "/detail",
    component: oldRedirect,
  },
];

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return new Promise((resolve) => {
      const check = () => {
        const nowHeight = document.body.scrollHeight;
        if (nowHeight < savedPosition.y) {
          window.scrollTo(savedPosition.x, savedPosition.y);
          setTimeout(() => {
            check();
          }, 200);
        } else {
          setTimeout(() => {
            resolve(savedPosition);
          }, 500);
        }
      };
      check();
    });
  } else {
    return { x: 0, y: 0 };
  }
};

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior,
});

export default router;
