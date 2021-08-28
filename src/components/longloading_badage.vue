<template>
  <p class="text has-text-centered" v-show="loading"><slot></slot></p>
</template>

<script>
export default {
  name: "LongLoadingBadage",
  props: {
    delay: {type: Number, default: 5000}
  },
  data() {
    return {
      stoploading: false,
      loading: false
    }
  },
  methods: {
    start() {
      setTimeout(() => {
        if (!this.stoploading) {
          this.loading = true
        }
        this.stoploading = false
      }, this.delay)
    },
    stop() {
      if (!this.stoploading) {
        this.stoploading = true
      }
      this.loading = false
    }
  }
};
</script>

<style scoped>

</style>