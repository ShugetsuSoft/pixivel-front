<template>
  <div>
    <div class="notification is-warning bookmark-info">
      关注个数: {{ followCount }}
      <div class="buttons">
        <b-button type="is-info" @click="sync">强制同步</b-button>
        <b-button type="is-warning" outlined inverted @click="clearAll"
          >清空所有</b-button
        >
      </div>
    </div>
    <UserList :users="follows" :has-load="hasLoad" @load="nextPage"></UserList>
  </div>
</template>

<script>
import UserList from "@/components/user_list";
import {
  countFollow,
  getFollow,
  clearFollow,
  syncFollow,
} from "@/utils/follow";

export default {
  name: "Follow",
  components: {
    UserList,
  },
  data() {
    return {
      follows: [],
      followPage: 0,
      followCount: 0,
      hasLoad: true,
    };
  },
  async created() {
    this.followCount = await countFollow();
  },
  methods: {
    async nextPage() {
      try {
        let loadedFollow = await getFollow(this.followPage);
        if (loadedFollow.length < 50) {
          this.hasLoad = false;
        }
        this.follows = this.follows.concat(loadedFollow);
        this.followPage += 1;
      } catch (e) {
        this.hasLoad = false;
        console.error(e);
      }
    },
    async sync() {
      await syncFollow();
      this.follows = [];
      this.followPage = 0;
      this.hasLoad = true;
      this.followCount = await countFollow();
    },
    clearAll() {
      this.$buefy.dialog.confirm({
        message: "真的要清空所有关注吗！此操作不可恢复！",
        cancelText: "点错了",
        confirmText: "真的",
        onConfirm: () => {
          this.$buefy.dialog.confirm({
            message: "红豆泥？！",
            cancelText: "NO",
            confirmText: "嗯",
            onConfirm: async () => {
              await clearFollow();
            },
          });
        },
      });
    },
  },
};
</script>

<style scoped></style>
