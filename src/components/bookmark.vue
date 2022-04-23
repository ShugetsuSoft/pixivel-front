<template>
  <div>
    <div class="notification is-info bookmark-info">
      收藏个数（最多收藏500个,还在测试捏）: {{ bookmarkCount }}
      <div class="buttons">
        <b-button type="is-info" inverted outlined @click="sync">强制同步</b-button>
        <b-button type="is-warning" outlined @click="clearAll">清空所有</b-button>
      </div>
    </div>
    <WaterFall :illusts="bookmark" :identifier="loadid" />
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
import { getBookMark, countBookMark, syncBookMark } from "@/utils/bookmark";
import WaterFall from "@/components/waterfall";
import { clearBookMark } from "../utils/bookmark";

export default {
  name: "Bookmark",
  components: {
    WaterFall
  },
  data() {
    return {
      bookmark: [],
      loadid: +new Date(),
      bookmarkPage: 0,
      bookmarkCount: 0
    }
  },
  async created() {
    this.bookmarkCount = await countBookMark()
  },
  methods: {
    async nextPage($state) {
      try {
        let loadedBookmark = await getBookMark(this.bookmarkPage)
        if (loadedBookmark.length < 1) {
          $state.complete()
        }
        this.bookmark = this.bookmark.concat(loadedBookmark)
        this.bookmarkPage += 1
        $state.loaded()
      } catch (e) {
       console.error(e)
        $state.error()
      }
    },
    async sync() {
      await syncBookMark()
      this.bookmark = []
      this.bookmarkPage = 0
      this.bookmarkCount = await countBookMark()
      this.loadid += 1
    },
    clearAll() {
      this.$buefy.dialog.confirm({
        message: '真的要清空所有收藏吗！此操作不可恢复！',
        cancelText: '点错了',
        confirmText: '真的',
        onConfirm: () => {
          this.$buefy.dialog.confirm({
            message: '红豆泥？！',
            cancelText: 'NO',
            confirmText: '嗯',
            onConfirm: async () => {
              await clearBookMark()
            }
          })
        }
      })
    }
  }
};
</script>

<style lang="scss">
.bookmark-info {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
}
</style>