<template>
  <section class="section default-full-screen-top no-padding-phone">
    <div class="container is-fluid no-padding-phone">
      <b-tabs v-model="tab">
        <b-tab-item value="announcement" label="公告">
          <b-message>
            论坛已经上线! 访问 <a href="https://forum.pixivel.moe/" target="_blank">https://forum.pixivel.moe/</a> 到达论坛
          </b-message>
        </b-tab-item>
        <b-tab-item value="downloads" label="下载队列">
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
        </b-tab-item>
        <b-tab-item value="settings" label="设置">
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
        </b-tab-item>
      </b-tabs>
    </div>
  </section>
</template>

<script>
export default {
  name: "More",
  data() {
    return {
      tab: "announcement",
    };
  },
  computed: {
    downloadTasks() {
      return this.$store.state.Pic.download.queue;
    },
    downloadingTasks() {
      return this.$store.state.Pic.download.downloadingQueue;
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
  },
};
</script>

<style lang="scss">
.set-list {
  flex-wrap: wrap;
}
</style>
