<template>
  <transition name="fade">
    <div class="totop-container" v-show="show">
      <b-button rounded type="is-info is-light" @click="handleClick">
        <b-icon
          pack="uil"
          icon="uil-arrow-up"
          type="is-dark"
          :class="{ down: downloadMode }"
        ></b-icon>
      </b-button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ToTopButton",
  watch: {
    $route() {
      this.handleScroll();
    },
  },
  data: () => ({
    downloadMode: false,
    show: true,
    threashold: 100,
  }),
  methods: {
    handleScroll() {
      this.downloadMode =
        window.scrollY < this.threashold && this.$route.name === "Landing";
      this.show =
        window.scrollY > this.threashold || this.$route.name === "Landing";
    },
    handleClick() {
      if (this.downloadMode) {
        this.bus.emit("bgDownload");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  mounted() {
    this.handleScroll();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped lang="scss">
.totop-container {
  position: fixed;
  bottom: 22px;
  right: 20px;
  z-index: 100;
  transition: all 0.1s ease-in-out;

  .button {
    height: 44px;
    width: 44px;

    .icon {
      transition: all 0.2s ease-in-out;
      transform: scale(2.3);
    }

    .down {
      transform: scale(2.3) rotate(180deg);
    }
  }

  &:hover {
    transform: scale(1.1);
  }
}

@media screen and (min-width: 790px) {
  .totop-container {
    bottom: 40px;
    right: 49px;

    .button {
      height: 54px;
      width: 54px;
    }
  }
}
</style>
