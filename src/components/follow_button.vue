<template>
  <b-button :type="{'is-primary': !isFollowed, 'is-danger': isFollowed}" size="is-small" inverted outlined @click.native="onclick">关注!</b-button>
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
        await deleteFollow(this.illust.id)
      } else {
        await addFollow(this.illust)
        this.isFollowed = true
      }
    }
  }
};
</script>

<style scoped>

</style>