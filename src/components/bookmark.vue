<template>
  <div>
    <div class="notification is-info bookmark-info">
      收藏个数: {{ bookmarkCount }}
      <div class="buttons">
        <b-button type="is-info" inverted outlined @click="sync">手动同步</b-button>
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
import { getBookMark, countBookMark, uploadBookMark } from "@/utils/bookmark";
import WaterFall from "@/components/waterfall";

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
      await uploadBookMark()
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