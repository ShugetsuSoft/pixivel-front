<template>
  <div class="horizontal-scroll" @wheel="wheel" ref="scroll">
    <template v-if="illusts.length > 0">
      <RouterA :to="{'name':'Detail', 'params':{'id': illust.id}}" class="scroll-item" v-for="illust in illusts" :key="illust.id">
        <LazyImg :src="url(illust)" />
        <div class="title-container">
          <h5 class="has-text-white" v-html="illust.title"></h5>
        </div>
      </RouterA>
    </template>
    <template v-else>
      <div class="scroll-item" v-for="i in 5" :key="i">
        <b-skeleton height="11rem"></b-skeleton>
      </div>
    </template>
  </div>
</template>

<script>
import LazyImg from '@/components/lazyimg'
import RouterA from '@/components/router_a'

export default {
  name: "HScroll",
  components: {
    LazyImg,
    RouterA
  },
  props: {
    'illusts': Array,
  },
  data() {
    return {
      scrollPos: 0,
      scrollStartTime: 0,
      duration: 800,
    }
  },
  methods: {
    url(illust) {
      return this.calcImg(illust.id, 0, illust.image, 'small')
    },
    scroll(timeCurrent) {
      let timeElapsed = timeCurrent - this.scrollStartTime
      let next = this.easeOut(timeElapsed, this.$refs.scroll.scrollLeft, this.scrollPos - this.$refs.scroll.scrollLeft, this.duration)
      this.$refs.scroll.scrollLeft = next
      if (timeElapsed < this.duration - 1) {
        window.requestAnimationFrame(this.scroll)
      } else {
        this.$refs.scroll.scrollLeft = this.scrollPos
        this.scrollStartTime = 0
      }
    },
    easeOut(t, b, c, d) {
      return b + c * Math.sin(((t/d) * Math.PI) / 2)
    },
    wheel(event) {
      event.preventDefault()
      if (this.scrollPos < 0) this.scrollPos = 0
      if (this.scrollPos > this.$refs.scroll.scrollWidth) this.scrollPos = this.$refs.scroll.scrollWidth
      if (this.scrollPos >= 0 && event.deltaY > 0 || this.scrollPos <= this.$refs.scroll.scrollWidth && event.deltaY < 0) {
        this.scrollPos += event.deltaY
        if (this.scrollStartTime == 0) {
          this.scrollStartTime = performance.now()
          window.requestAnimationFrame(this.scroll)
        } else {
          this.scrollStartTime = performance.now() - 90
        }
      }
    }
  }
};
</script>

<style lang="scss">
  .horizontal-scroll {
    margin: {
      top: 1rem;
    }
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    width: 100%;

    .scroll-item {
      position: relative;
      display: inline-block;
      width: 11rem;
      height: 11rem;
      margin-right: 8px;
      border-radius: 10px;
      overflow: hidden;
      &:hover {
        .lazyimg {
          transform: scale(1.2);
        }
      }
      .lazyimg {
        transition: all .6s;
      }

      &:after {
        position: absolute;
        border-radius: 10px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 0;
        content: "";
        width: 100%;
        box-sizing: border-box;
        height: 100%;
        background-image: linear-gradient(
            0deg,rgba(50,50,50,.2),hsla(0,0%,100%,0));
      }
    }

    .title-container {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 15;
      justify-content: center;
      padding-left: 0;
      margin-right: 15%;
      margin-left: 15%;
      list-style: none;
      display: flex;
      h5 {
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>