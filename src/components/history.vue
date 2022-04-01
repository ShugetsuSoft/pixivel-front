<template>
  <div>
    <div class="notification is-info history-info">
      历史记录个数: {{ historyCount }}
      <div class="buttons">
        <b-button type="is-primary" inverted outlined @click="clearHistory">删除历史记录</b-button>
      </div>
    </div>
    <WaterFall :illusts="history" :identifier="loadid" />
    <infinite-loading
      @infinite="nextPage"
      spinner="spiral"
      :identifier="loadid"
      ref="infload"
    >
      <div slot="no-more">加载完毕</div>
      <div slot="no-results">没结果</div>
    </infinite-loading>
  </div>
</template>

<script>
import { getHistory, countHistory, clearHistory } from "@/utils/history";
import WaterFall from "@/components/waterfall";

export default {
  name: "History",
  components: {
    WaterFall
  },
  data() {
    return {
      history: [],
      loadid: +new Date(),
      historyPage: 0,
      historyCount: 0
    }
  },
  async created() {
    this.historyCount = await countHistory()
  },
  methods: {
    async clearHistory() {
      await clearHistory()
      this.historyCount = 0
      this.historyPage = 0
      this.history = []
    },
    async nextPage($state) {
      try {
        let loadedHistory = await getHistory(this.historyPage)
        if (loadedHistory.length < 1) {
          $state.complete()
        }
        this.history = this.history.concat(loadedHistory)
        this.historyPage += 1
        $state.loaded()
      } catch (e) {
       console.error(e)
        $state.error()
      }
    }
  }
};
</script>

<style lang="scss">
.history-info {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
}
</style>