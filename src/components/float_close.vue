<template>
  <div class="float-close">
    <b-button size="is-medium" v-show="canshow" @click="back">
      <b-icon pack="uil" icon="uil-angle-left"></b-icon>
    </b-button>
  </div>
</template>

<script>
export default {
  name: "FloatClose",
  computed: {
    canshow() {
      if (window.history.length <= 1) return false
      if (this.$route) {
        if (this.$route.name == "Landing") return false
      }
      return true
    }
  },
  methods: {
    back() {
      this.$router.back()
    }
  }
};
</script>

<style lang="scss">
.float-close {
  position: fixed;
  left: 20px;
  top: 25px;
  z-index: 25565;
}
</style>