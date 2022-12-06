<template>
  <section class="section default-full-screen-top no-padding-phone">
    <div class="container">
      <section class="hero is-primary banner">
        <div class="hero-body">
          <div class="container has-text-centered">
            <div class="media">
              <figure class="media-left">
                <p class="image is-64x64">
                  <img
                    class="is-rounded"
                    :src="isLoggedIn ? userAvatar : defaultAvatar"
                  />
                </p>
              </figure>
              <div class="media-content">
                <div class="content" v-if="isLoggedIn">
                  <p>
                    <strong>{{ userInfo.username }}</strong>
                    <small>@{{ userInfo.userid }}</small>
                    <br />
                    {{ userInfo.email }}
                  </p>
                </div>

                <div class="content" v-else>
                  <p>
                    <strong>还没登录喵！</strong>
                    <br />
                    登录以后可以启用收藏和关注功能
                  </p>
                </div>
              </div>
              <div class="buttons">
                <b-button type="is-primary" inverted @click="logInOrOut">{{
                  isLoggedIn ? "登出" : "登录"
                }}</b-button>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-foot">
          <nav class="tabs">
            <div class="container">
              <ul class="is-justify-content-center link-tabs">
                <li :class="{ 'link-active': tabNow == 0 }" @click="tabNow = 0">
                  <a>主页</a>
                </li>

                <li
                  :class="{ 'link-active': tabNow == 3 }"
                  @click="tabNow = 3"
                  v-if="isLoggedIn"
                >
                  <a>收藏</a>
                </li>
                <li
                  :class="{ 'link-active': tabNow == 4 }"
                  @click="tabNow = 4"
                  v-if="isLoggedIn"
                >
                  <a>关注</a>
                </li>
                <li :class="{ 'link-active': tabNow == 5 }" @click="tabNow = 5">
                  <a>历史记录</a>
                </li>

                <li :class="{ 'link-active': tabNow == 1 }" @click="tabNow = 1">
                  <a>下载</a>
                </li>
                <li :class="{ 'link-active': tabNow == 2 }" @click="tabNow = 2">
                  <a>设置</a>
                </li>

                <li :class="{ 'link-active': tabNow == 6 }" @click="tabNow = 6">
                  <a>友情链接</a>
                </li>
                <li>
                  <a href="https://forum.pixivel.moe/" target="_blank">论坛</a>
                </li>
                <li>
                  <a href="https://nekonya.fun/" target="_blank">图站</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
      <section v-if="tabNow == 0">
        <h3 class="title is-3">公告</h3>
        <b-message
          v-for="(value, key) in announce"
          :key="key"
          type="is-success"
        >
          <div v-html="value"></div>
        </b-message>
      </section>
      <section v-else-if="tabNow == 1">
        <div class="notification" v-if="!hasDownloadTask">
          没有正在进行的下载任务喵！
        </div>
        <div class="columns set-list">
          <div
            class="column is-half-desktop is-half-tablet"
            v-for="(progress, iden) in downloadingTasks"
            :key="iden"
          >
            <b-notification :closable="false">
              <b-taglist>
                <b-tag type="is-link"
                  >TYPE: {{ JSON.parse(iden)["type"] }}</b-tag
                >
                <b-tag type="is-info">ID: {{ JSON.parse(iden)["id"] }}</b-tag>
                <b-tag type="is-info"
                  >PAGE: {{ JSON.parse(iden)["page"] }}</b-tag
                >
              </b-taglist>
              <b-progress
                type="is-success"
                :value="progress * 100"
                show-value
              ></b-progress>
            </b-notification>
          </div>

          <div
            class="column is-half-desktop is-half-tablet"
            v-for="(task, index) in downloadTasks"
            :key="JSON.stringify(task) + '.task'"
          >
            <b-notification @close="removeTask(index)">
              <b-taglist>
                <b-tag type="is-link">TYPE: {{ task["type"] }}</b-tag>
                <b-tag type="is-info">ID: {{ task["id"] }}</b-tag>
                <b-tag type="is-info">PAGE: {{ task["page"] }}</b-tag>
              </b-taglist>
              <b-progress type="is-success" show-value></b-progress>
            </b-notification>
          </div>
        </div>
      </section>
      <section v-else-if="tabNow == 2">
        <br />
        <div class="columns set-list">
          <div class="column is-one-third-desktop is-full-mobile">
            <b-field label="下载文件名格式">
              <b-input
                :value="getdownloadfilename"
                @blur="setdownloadfilename"
              ></b-input>
            </b-field>
          </div>
          <div class="column is-one-third-desktop is-full-mobile">
            <b-field label="首页推荐敏感度过滤">
              <b-numberinput
                :controls="false"
                :value="getsamplesanityfilter"
                :min="2"
                :max="8"
                @blur="setsamplesanityfilter"
              ></b-numberinput>
            </b-field>
          </div>
          <div class="column is-one-third-desktop is-full-mobile">
            <b-field label="全局敏感度过滤">
              <b-numberinput
                :controls="false"
                :value="getglobalsanityfilter"
                :min="2"
                :max="8"
                @blur="setglobalsanityfilter"
              ></b-numberinput>
            </b-field>
          </div>
        </div>
        <div class="columns set-list">
          <div class="column is-one-third-desktop is-full-mobile">
            <b-field label="推荐热门度筛选">
              <b-numberinput
                :controls="false"
                :value="getrecommendquality"
                :min="0"
                :max="400000"
                @blur="setrecommendquality"
              ></b-numberinput>
            </b-field>
          </div>
        </div>
      </section>
      <section v-else-if="tabNow == 3">
        <Bookmark />
      </section>
      <section v-else-if="tabNow == 4">
        <Follow />
      </section>
      <section v-else-if="tabNow == 5">
        <History />
      </section>

      <section v-if="tabNow == 6">
        <div class="columns set-list">
          <div
            class="column is-one-third-desktop is-half-tablet hover-up"
            @click="jump(link.link)"
            v-for="link in links"
            :key="link.name"
          >
            <b-notification :closable="false" class="is-clickable">
              <div class="is-flex is-flex-wrap-nowrap is-align-items-center">
                <figure class="image is-64x64 media-left">
                  <img class="is-rounded" :src="link.ava" />
                </figure>
                <div class="content">
                  <strong>{{ link.name }}</strong>
                  <p>
                    {{ link.desc }}<a>{{ link.link }}</a>
                  </p>
                </div>
              </div>
            </b-notification>
          </div>
        </div>
      </section>
    </div>
    <b-modal
      :active="showLoginPanel"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
      aria-modal
    >
      <template>
        <Login @close="showLoginPanel = false"></Login>
      </template>
    </b-modal>
  </section>
</template>

<script>
import { deleteToken, getUserInfo, isLoggedIn } from "@/utils/account";
import md5 from "@/utils/md5";
import CONFIG from "@/config.json";
import storage from "store2";
import Login from "@/components/login";
import History from "@/components/history";
import Bookmark from "@/components/bookmark";
import Follow from "@/components/follow";

const AnnounceKey = "announce";

export default {
  name: "Account",
  components: {
    Login,
    History,
    Bookmark,
    Follow,
  },
  data() {
    return {
      tabNow: 0,
      showLoginPanel: false,
      announce: window.JSON.parse(storage.get(AnnounceKey, "{}")),
      defaultAvatar: "https://bucket.nekonya.fun/others/pixivel/defaultAva.jpg",
      links: [
        {
          name: "Rorical",
          ava: "https://avatars.githubusercontent.com/u/46294886?v=4",
          desc: "开发者，是白毛萌妹（雾）",
          link: "https://rorical.blue",
        },
        {
          name: "Matrew File",
          ava: "https://avatars.githubusercontent.com/u/28867264?v=4",
          desc: "运维，也许会变成绿毛萌妹（大雾）",
          link: "https://elfile4138.moe",
        },
        {
          name: "墨影",
          ava: "https://doc.kmf.com/ke-feedback/2022/09/01/15/47/25/20220901154722.png",
          desc: "管理，NekoNya 编辑，可食用猪猪（大大雾）",
          link: "https://space.bilibili.com/36999062/",
        },
        {
          name: "Shugetsu Soft",
          ava: "https://avatars.githubusercontent.com/u/79077644?s=200&v=4",
          desc: "Where no magic happens.",
          link: "https://shugetsu.dev/",
        },
      ],
    };
  },
  watch: {
    tabNow() {
      if ("#" + this.tabNow.toString() == this.$route.hash) return;
      this.$router.replace({
        name: "Account",
        hash: "#" + this.tabNow.toString(),
      });
    },
    $route() {
      if ("#" + this.tabNow.toString() == this.$route.hash) return;
      this.tabNow = parseInt(this.$route.hash.split("#")[1]);
    },
  },
  created() {
    if (this.$route.hash.length > 1) {
      this.tabNow = parseInt(this.$route.hash.split("#")[1]);
    }
  },
  computed: {
    isLoggedIn() {
      return isLoggedIn();
    },
    userInfo() {
      return getUserInfo();
    },
    userAvatar() {
      return CONFIG.GRAVATAR_PROXY + md5(this.userInfo.email);
    },
    downloadTasks() {
      return this.$store.state.Pic.download.queue;
    },
    downloadingTasks() {
      return this.$store.state.Pic.download.downloadingQueue;
    },
    hasDownloadTask() {
      return (
        Object.keys(this.$store.state.Pic.download.downloadingQueue).length >
          0 || this.$store.state.Pic.download.queue.length > 0
      );
    },
    getdownloadfilename() {
      return this.$store.getters["Settings/get"]("download.filename");
    },
    getsamplesanityfilter() {
      return this.$store.getters["Settings/get"]("sample.sanity_filter");
    },
    getglobalsanityfilter() {
      return this.$store.getters["Settings/get"]("global.sanity_filter");
    },
    getrecommendquality() {
      return this.$store.getters["Settings/get"]("recommend.quality");
    },
  },
  methods: {
    removeTask(index) {
      this.$store.commit("Pic/removeDownloadTask", index);
    },
    setdownloadfilename(e) {
      this.$store.commit("Settings/set", {
        key: "download.filename",
        value: e.target.value,
      });
    },
    setsamplesanityfilter(e) {
      this.$store.commit("Settings/set", {
        key: "sample.sanity_filter",
        value: parseInt(e.target.value),
      });
    },
    setglobalsanityfilter(e) {
      this.$store.commit("Settings/set", {
        key: "global.sanity_filter",
        value: parseInt(e.target.value),
      });
    },
    setrecommendquality(e) {
      this.$store.commit("Settings/set", {
        key: "recommend.quality",
        value: parseInt(e.target.value),
      });
    },
    logInOrOut() {
      if (this.isLoggedIn) {
        this.$buefy.dialog.confirm({
          title: "退出登录",
          message: `确定要退出登录嘛?<br>退出登录后本地将无法访问你的数据，需要重新登录才可以`,
          cancelText: "算了",
          confirmText: "嗯",
          type: "is-success",
          onConfirm: () => {
            deleteToken();
            this.$router.go(0);
          },
        });
      } else {
        this.showLoginPanel = true;
      }
    },
    jump(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="scss">
.banner {
  border-radius: 10px;
  margin-bottom: 2rem;

  .message {
    transition: none;
  }

  .hero-body {
    padding: 2rem 2rem;
  }
  .link-tabs {
    li {
      transition: all 0.2s ease-in-out;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .link-active {
      background-color: #fff;
      color: #009e86;
    }
  }
}

.media {
  align-items: center;
}

.set-list {
  flex-wrap: wrap;
}

.hover-up:hover {
  transform: translateY(-5px) scale(1.02);
}

.hover-up {
  transition: transform 0.1s ease-in-out;
}
</style>
