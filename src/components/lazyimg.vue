<template>
  <div
    :style="{ 'background-image': `url(${imgUrl})` }"
    class="lazyimg"
    ref="img"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "LazyImg",
  props: {
    src: String,
  },
  data() {
    return {
      imgUrl: "",
      preload: null,
    };
  },
  watch: {
    src: "load",
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      /*
				let reader = new FileReader()
				reader.onload = (e) => {
					const blob = new Blob([new Uint8Array(e.target.result)])
					const url = URL.createObjectURL(blob)
					this.imgUrl = url
					this.$emit('loaded', (url))
				}
				this.axios.get(this.src, {
					responseType: 'blob'
				}).then((response) => {
					reader.readAsArrayBuffer(response.data)
				})
				*/
      if (this.$store.getters["Pic/hasCached"](this.src)) {
        this.imgUrl = this.src;
        this.$emit("preloaded");
        return;
      }
      this.preload = new Image();
      this.preload.src = this.src;
      if (this.preload.complete) {
        this.imgUrl = this.preload.src;
        this.$emit("preloaded");
        this.$store.commit("Pic/setCacheImg", this.src);
        return;
      }
      this.preload.onload = () => {
        this.imgUrl = this.preload.src;
        this.$emit("loaded");
        this.$store.commit("Pic/setCacheImg", this.src);
      };
      this.preload.onerror = () => {
        this.$emit("error");
      };
    },
  },
};
</script>

<style lang="scss">
.lazyimg {
  width: 100%;
  height: 100%;

  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
}
</style>
