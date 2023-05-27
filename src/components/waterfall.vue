<template>
  <div class="waterfall" ref="waterfall">
    <VirtualMasonry
      ref="masonry"
      :items="illustsFiltered"
      :colWidth="width"
      :fit="true"
      :rowPerSection="4"
      :col="cols"
      :itemHeightGetter="heightGetter"
      :gap="nowGap"
      class="waterfall-container"
    >
      <template slot-scope="illust">
        <AdsCard v-if="illust.data.type == -1" />
        <ImgCard :illust="illust.data" v-else />
      </template>
    </VirtualMasonry>
  </div>
</template>

<script>
import ImgCard from "@/components/imgcard";
import AdsCard from "@/components/adscard";

export default {
  name: "WaterFall",
  props: {
    illusts: Array,
    "expect-width": {
      default: 280,
      type: Number,
    },
    "expect-width-mobile": {
      default: 170,
      type: Number,
    },
    gap: {
      default: 25,
      type: Number,
    },
    "gap-mobile": {
      default: 18,
      type: Number,
    },
  },
  components: {
    ImgCard,
    AdsCard,
  },
  watch: {
    illusts: "illustsChange",
  },
  data() {
    return {
      width: this.expectWidth,
      containerWidth: 0,
      parentObserver: null,
      cols: 0,
      calcdebu: null,
      showAd: -1,
    };
  },
  mounted() {
    let parentNode = this.$refs.waterfall.parentNode;
    this.containerWidth = parentNode.offsetWidth;
    this.parentObserver = new window.ResizeObserver((entries) => {
      let entry = entries[0];
      this.containerResized(entry);
    });
    this.parentObserver.observe(parentNode);
    this.calc();
    let that = this;
    this.calcdebu = this.Lodash.debounce(() => {
      that.calc();
    }, 100);
  },
  beforeDestroy() {
    if (this.parentObserver) {
      this.parentObserver.disconnect();
      this.parentObserver = null;
    }
  },
  computed: {
    nowGap() {
      if (this.containerWidth > 435) {
        return this.gap;
      } else {
        return this.gapMobile;
      }
    },
    expWidth() {
      if (this.containerWidth > 435) {
        return this.expectWidth + this.gap;
      } else {
        return this.expectWidthMobile + this.gapMobile;
      }
    },
    illustsFiltered() {
      let sanity = this.$store.getters["Settings/get"]("global.sanity_filter");
      let ban_ai = this.$store.getters["Settings/get"]("global.ai_filter");
      let illusts = this.illusts.filter((item) => {
        return item.sanity < sanity;
      });
      if (ban_ai === true) {
        illusts = this.illusts.filter((item) => {
          return item.aiType === 0;
        });
      }
      if (this.showAd !== -1 && illusts.length > this.showAd) {
        illusts.splice(this.showAd, 0, {
          type: -1,
          height: 259,
          width: 311,
        });
      }
      return illusts;
    },
  },
  methods: {
    illustsChange() {
      if (this.illusts.length == 0) {
        this.$refs.masonry.displayItems = [];
      }
    },
    heightGetter(item) {
      let resizedHeight = (item.height / item.width) * this.width;
      if (resizedHeight > 900) return 900;
      return resizedHeight;
    },
    containerResized(entry) {
      this.containerWidth = Math.floor(entry.contentRect.width);
      this.calcdebu();
    },
    calc() {
      let num = parseInt(this.containerWidth / this.expWidth);
      let rem = this.containerWidth % this.expWidth;
      if (rem >= this.expWidth / 2) {
        num += 1;
      }
      let width = this.containerWidth / num;
      if (this.cols != num) {
        this.cols = num;
      }
      this.width = width - this.gap;
    },
  },
};
</script>

<style lang="scss">
.waterfall {
  .waterfall-container {
    position: relative;
    margin: 0 auto;
  }
}
</style>
