<template>
  <div id="app">
    <Nav />
    <keep-alive>
      <transition name="fade">
        <router-view />
      </transition>
    </keep-alive>
    <Footer />
    <b-modal v-model="showSponsor" has-modal-card trap-focus>
      <template>
        <Sponsor @close="showSponsor = false" />
      </template>
    </b-modal>
  </div>
</template>

<script>
import Nav from "@/components/nav";
import Footer from "@/components/footer.vue";
import CheckAnnounce from "@/utils/checkAnnounce";
import Sponsor from "@/components/sponsor";
import storage from "store2";
import { clearAccountInformation, isLoggedIn } from "@/utils/account";
import { syncBookMark } from "@/utils/bookmark";
import { syncFollow } from "@/utils/follow";

export default {
  name: "App",
  components: {
    Nav,
    Footer,
    Sponsor,
  },
  data() {
    return {
      showSponsor: false,
    };
  },
  async mounted() {
    this.sponsorShow();
    this.announceShow();
    this.addDownloadNotify();
    await this.syncHook();
    window.addEventListener(
      "new-content-available",
      this.showNewContentAvailable
    );
  },
  methods: {
    async syncHook() {
      if (isLoggedIn()) {
        await syncBookMark();
        await syncFollow();
      } else {
        if (storage.has("refresh_token")) {
          clearAccountInformation();
        }
      }
      document.addEventListener("visibilitychange", function () {
        if (isLoggedIn()) {
          syncBookMark();
          syncFollow();
        }
      });
    },
    announceShow() {
      CheckAnnounce().then((Anno) => {
        let infoshow = "";
        Anno[0].forEach((key, index) => {
          infoshow += Anno[1][key];
          if (index < Anno[0].length - 1) {
            infoshow += "<hr>";
          }
        });
        if (infoshow != "") {
          this.$buefy.notification.open({
            duration: 60000,
            message: infoshow,
            type: "is-primary",
          });
        }
      });
    },
    sponsorShow() {
      let lastTime = storage.get("last_sponsor_show_time", 0);
      let now = new Date().getTime();
      if (lastTime < now - 864000000) {
        // ten days
        this.showSponsor = true;
        storage.set("last_sponsor_show_time", now);
      }
    },
    addDownloadNotify() {
      window.addEventListener("beforeunload", (e) => {
        if (!this.$store.getters["Pic/isDownloadFinish"]) {
          e.preventDefault();
          e.returnValue = "未完成的下载任务！";
          return true;
        }
        return false;
      });
    },
    showNewContentAvailable() {
      this.$buefy.snackbar.open({
        message: "网站有更新啦，来加载新内容吧！",
        type: "is-warning",
        actionText: "更新",
        indefinite: true,
        onAction: () => {
          this.$buefy.toast.open({
            message: "准备更新",
            type: "is-success",
            queue: false,
          });
          window.dispatchEvent(new Event("skip-waiting"));
        },
      });
    },
  },
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
  color: #111;

  font-family: "ResourceHanRoundedCN Regular", "ResourceHanRoundedCN Light" !important;
}

@media (prefers-color-scheme: light) {
  html,
  body {
    background-color: #fdfdfd;
  }
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "ResourceHanRoundedCN Medium" !important;
}

.no-margin-bottom {
  margin-bottom: 0 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
	.fade-leave-to

	/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

::selection {
  background: rgba(0, 0, 0, 0.15);
}

::-webkit-scrollbar-thumb {
  background: #8c8c8c;
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background: #ededed;
  border-radius: 5px;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  display: block;
  background: #fff;
  border-radius: 5px;
}

.default-full-screen-top {
  min-height: 100vh;
}

.is-rounded {
  border-radius: 50%;
}

.is-vertical-centered {
  align-items: center;
}

.break-raw-text {
  white-space: pre-wrap;
}

.full-hw {
  height: 100% !important;
  width: 100% !important;
}

.clickable-tag {
  cursor: pointer;
  user-select: none !important;
}

.loading-overlay-custom {
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  overflow: hidden;
  z-index: 999;
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100%;

  .loading-icon-custom {
    position: relative;

    &::after {
      animation: spinAround 500ms infinite linear;
      border: 2px solid #dbdbdb;
      border-radius: 9999px;
      border-right-color: transparent;
      border-top-color: transparent;
      content: "";
      display: block;
      height: 1em;
      position: relative;
      width: 1em;
      position: absolute;
      top: calc(50% - 1.5em);
      left: calc(50% - 1.5em);
      width: 3em;
      height: 3em;
      border-width: 0.25em;
    }
  }
}

@media screen and (max-width: 790px) {
  .hide-on-phone {
    display: none !important;
  }
}

@media screen and (min-width: 790px) {
  .hide-on-computer {
    display: none !important;
  }
}

.return-container {
  .subtitle {
    margin-bottom: 0;
  }
  margin-bottom: 3.3rem !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
