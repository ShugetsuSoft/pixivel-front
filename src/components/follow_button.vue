<template>
  <b-button :type="{'is-primary': !isFollowed, 'is-danger': isFollowed}" size="is-small" @click.native="onclick">{{ isFollowed ? "已经关注" : "关注!" }}</b-button>
</template>

<script>
import { isFollowed, addFollow, deleteFollow } from "@/utils/follow";

export default {
  name: "Follow",
  props: {
    user: Object
  },
  data() {
    return {
      isFollowed: false,
    }
  },
  async created() {
    this.isFollowed = await isFollowed(this.user.id)
  },
  methods: {
    async onclick(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.isFollowed) {
        this.isFollowed = false
        await deleteFollow(this.user.id)
      } else {
        await addFollow(this.user)
        this.isFollowed = true
      }
    }
  }
};
</script>

<style scoped>

</style>