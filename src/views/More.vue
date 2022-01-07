<template>
  <section class="section default-full-screen-top no-padding-phone">
    <div class="container is-fluid no-padding-phone">
      <b-tabs v-model="tab">
        <b-tab-item value="downloads" label="下载队列">
          <div class="columns downloads-list">
            <div class="column is-half-desktop is-half-tablet" v-for="(progress, iden) in downloadingTasks" :key="iden">
              <b-notification :closable="false">
                <b-taglist>
                  <b-tag type="is-link">TYPE: {{ JSON.parse(iden)["type"] }}</b-tag>
                  <b-tag type="is-info">ID: {{ JSON.parse(iden)["id"] }}</b-tag>
                  <b-tag type="is-info">PAGE: {{ JSON.parse(iden)["page"] }}</b-tag>
                </b-taglist>
                <b-progress
                  type="is-success"
                  :value="progress * 100"
                  show-value
                ></b-progress>
              </b-notification>
            </div>

            <div class="column is-half-desktop is-half-tablet" v-for="(task, index) in downloadTasks" :key="JSON.stringify(task) + '.task'">
              <b-notification @close="removeTask(index)">
                <b-taglist>
                  <b-tag type="is-link">TYPE: {{ task["type"] }}</b-tag>
                  <b-tag type="is-info">ID: {{ task["id"] }}</b-tag>
                  <b-tag type="is-info">PAGE: {{ task["page"] }}</b-tag>
                </b-taglist>
                <b-progress
                  type="is-success"
                  show-value
                ></b-progress>
              </b-notification>
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
      tab: "downloads",
    }
  },
  computed: {
    downloadTasks() {
      return this.$store.state.Pic.download.queue
    },
    downloadingTasks() {
      return this.$store.state.Pic.download.downloadingQueue
    }
  },
  methods: {
    removeTask(index) {
      this.$store.commit("Pic/removeDownloadTask", index)
    }
  }
};
</script>

<style lang="scss">
.downloads-list {
  flex-wrap: wrap;
}
</style>