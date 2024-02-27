import Vue from "vue";
import App from "@/App.vue";

import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "@/assets/fonts/font.scss";
import "@/assets/css/bulmaswatch.min.css";
import "@/assets/sass/dark.sass";

import axios from "axios";
import VueAxios from "vue-axios";
import VirtualMasonry from "vue-virtual-masonry";
import InfiniteLoading from "vue-infinite-loading";
import Lodash from "lodash";
import "@/utils/prototypes";
Vue.prototype.Lodash = Lodash;
import moment from "moment";
moment.locale("zh-cn");
Vue.prototype.moment = moment;
import mitt from "mitt";
Vue.prototype.bus = mitt();

Vue.filter("dateFormat", function (daraStr, pattern = "YYYY-MM-DD HH:mm:ss") {
  return moment(daraStr).format(pattern);
});
import CONFIG from "@/config.json";

import "@iconscout/unicons/css/line.css";

import router from "@/router";
Vue.config.productionTip = false;

import ImgReso from "@/utils/ImgReso";
import Store from "@/store";
import "./registerServiceWorker";

axios.interceptors.request.use((config) => {
  if (!config["background"]) {
    config.cancelToken = new axios.CancelToken((e) => {
      Store.commit("CancelRequests/addCancelToken", e);
    });
  }
  return config;
});

router.beforeEach((to, from, next) => {
  Store.commit("CancelRequests/clearCancelToken");
  next();
});

Vue.use(Buefy);
Vue.use(VueAxios, axios);
Vue.prototype.calcImg = ImgReso.calcImg;
Vue.prototype.imgProxy = ImgReso.imgProxy;
Vue.prototype.calcUgoira = ImgReso.calcUgoira;
Vue.prototype.getDownloadMessage = () => {
  return CONFIG.DOWNLOAD_DEFAULT.TASK_MESSAGES[
    Math.floor(Math.random() * CONFIG.DOWNLOAD_DEFAULT.TASK_MESSAGES.length)
  ];
};
Vue.use(VirtualMasonry, {
  additionalDistance: 1000,
});
Vue.use(InfiniteLoading);

import * as Sentry from "@sentry/vue";
Sentry.init({
  Vue,
  dsn: "https://aacac271449bf7d53d2436726ff5839a@o4506819751968768.ingest.sentry.io/4506819754786816",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost"],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

new Vue({
  router,
  render: (h) => h(App),
  store: Store,
}).$mount("#app");
