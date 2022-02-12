<template>
  <div class="horizontal-scroll" @wheel="wheel" ref="scroll" @scroll="onscroll">
      <RouterA :to="{'name':'Detail', 'params':{'id': illust.id}}" class="scroll-item" v-for="illust in illustsFiltered" :key="illust.id" :style="{'height': wh+'px', 'width': wh+'px'}">
        <LazyImg :src="url(illust)" />
        <div class="title-container">
          <h5 class="has-text-white" v-html="illust.title"></h5>
        </div>
        <div class="page-count">
          <b-tag type="is-info" v-if="illust.pageCount > 1">
            <b-icon pack="uil" icon="uil-layers" size="is-small"></b-icon>
            {{ illust.pageCount }}
          </b-tag>
          <b-tag type="is-primary" v-if="illust.type == 2">
            <b-icon pack="uil" icon="uil-video" size="is-small"></b-icon>
          </b-tag>
        </div>
      </RouterA>
    <template v-if="hasLoad">
      <div class="scroll-item" v-for="i in 10" :key="i" ref="loadSpan">
        <b-skeleton :height="wh+'px'" :width="wh+'px'"></b-skeleton>
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
    'has-load': Boolean,
    "wh": {
      type: Number,
      default: 176,
    }
  },
  data() {
    return {
      scrollPos: 0,
      scrollStartTime: 0,
      duration: 800,
      loadingObserver: null,
    }
  },
  watch: {
    hasLoad: function() {
      if(this.hasLoad) {
        let triggerEle = this.$refs.loadSpan[0]
        this.loadingObserver = new window.IntersectionObserver(entries => {
          let entry = entries[0]
          this.onloading(entry)
        })
        this.loadingObserver.observe(triggerEle)
      }
    }
  },
  mounted() {
    if(this.hasLoad) {
      let triggerEle = this.$refs.loadSpan[0]
      this.loadingObserver = new window.IntersectionObserver(entries => {
        let entry = entries[0]
        this.onloading(entry)
      })
      this.loadingObserver.observe(triggerEle)
    }
  },
  computed: {
    illustsFiltered() {
      let sanity = this.$store.getters["Settings/get"]("global.sanity_filter")
      return this.illusts.filter((item) => {
        return item.sanity < sanity
      })
    }
  },
  beforeDestroy() {
    if (this.loadingObserver) {
      this.loadingObserver.disconnect()
      this.loadingObserver = null
    }
  },
  methods: {
    scrollTo(pos) {
      this.scrollPos = pos
      if (this.scrollPos < 0) this.scrollPos = 0
      if (this.scrollPos > this.$refs.scroll.scrollWidth) this.scrollPos = this.$refs.scroll.scrollWidth
      this.$refs.scroll.scrollTo({
        left: this.scrollPos,
      })
      if (this.$refs.loadSpan[0].offsetLeft - this.$refs.scroll.scrollLeft <= this.$refs.scroll.clientWidth) {
       this.onloading({
         intersectionRatio: 1
       })
      }
      this.scrollStartTime = 0
    },
    onloading(entry) {
      if (entry.intersectionRatio <= 0) return
      this.$emit('load')
    },
    onscroll() {
      if (this.scrollStartTime == 0) {
        this.scrollPos = this.$refs.scroll.scrollLeft
      }
    },
    url(illust) {
      return this.calcImg(illust.id, illust.type == 2 ? -1 : 0, illust.image, 'small')
    },
    scroll(timeCurrent) {
      if (!this.$refs.scroll) {
        this.scrollStartTime = 0
        return
      }
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
      margin-right: 8px;
      border-radius: 10px;
      overflow: hidden;

      .page-count {
        position: absolute;
        top: 6px;
        right: 10px;

        .is-info {
          opacity: 0.7;

          .icon {
            padding-right: 3px;
            padding-left: 1px;
          }
        }
      }

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